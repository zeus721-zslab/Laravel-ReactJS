<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request; // Request 클래스 사용
use Inertia\Response;
use Inertia\Inertia;
// use Elasticsearch\ClientBuilder; // 원래 써야 하는 것 주석 처리
use Elastic\Elasticsearch\ClientBuilder; // 잘못된 맵에 맞춰서 임시로 사용
use Illuminate\Support\Facades\Log;     // 로그 사용
use Illuminate\Support\Str;             // Str 헬퍼 사용 (예시 데이터용)

class ELKController extends Controller
{

    /* ------------------------- WEB */
    public function Index(): Response
    {

        $elasticsearchClient = null;
        $hits = [];
        $error = null;

        try {

            $hostConfig = config('services.elasticsearch.hosts.0');
            $scheme = $hostConfig['scheme'] ?? 'http';
            $host = $hostConfig['host'] ?? 'elk_elasticsearch'; // 서비스 이름 사용
            $port = $hostConfig['port'] ?? 9200;

            // ... (호스트 문자열 조합 부분은 동일) ...
            $hostString = sprintf('%s://%s:%s', $scheme, $host, $port);

            // --- ClientBuilder 생성 시 HttpClient 옵션으로 타임아웃 설정 추가 ---
            $elasticsearchClient = ClientBuilder::create()
                ->setHosts([$hostString])
                ->setHttpClientOptions([ // HTTP 클라이언트 옵션 설정
                    'connect_timeout' => 5, // 연결 타임아웃 (초)
                    'timeout' => 5        // 전체 요청 타임아웃 (초)
                ])
                ->build();

            // Kibana에서 확인한 실제 이커머스 샘플 데이터 인덱스 이름
            $indexName = 'laravel_app_events';
            $dateField = 'timestamp'; // 정렬 기준으로 사용할 날짜/시간 필드

            // Elasticsearch 검색 쿼리 (예: 모든 데이터 10개 가져오기)
            $params = [
                'index' => $indexName,
                'body'  => [
                    'query' => [
                        'match_all' => new \stdClass() // 모든 문서 매칭 ({})
                    ]
                    , 'sort' => [
                        // $dateField 변수에 지정된 필드('timestamp')를 기준으로
                        // 내림차순('desc' - descending) 정렬 (최신 데이터가 위로)
                        [ $dateField => ['order' => 'desc'] ]
                    ]
                ],
                'size' => 10 // 가져올 문서 개수 제한
            ];

            $response = $elasticsearchClient->search($params);
            $hits = $response['hits']['hits']; // 실제 데이터 배열 (_source 포함)

        } catch (\Elasticsearch\Common\Exceptions\NoNodesAvailableException $e) {
            $error = "Elasticsearch 서버에 연결할 수 없습니다: " . $e->getMessage();
        } catch (\Exception $e) {
            $error = "데이터 조회 중 오류 발생: " . $e->getMessage();
        }

        $resp = [
            'hits' => $hits,
            'error' => $error
        ];

        return Inertia::render('ELK/Index', $resp);

    }


    /* ------------------------- API */
    /**
     * Elasticsearch에 새 데이터를 저장(인덱싱)합니다.
     * POST /api/elk/add-data 요청을 처리합니다.
     */
    public function store(Request $request) // Request 객체를 주입받을 수 있습니다.
    {
        try {
            // 1. 클라이언트 생성 (이전 성공 방식 유지)
            $hostConfig = config('services.elasticsearch.hosts.0');
            $scheme = $hostConfig['scheme'] ?? 'http';
            $host = $hostConfig['host'] ?? 'elk_elasticsearch'; // 서비스 이름 사용
            $port = $hostConfig['port'] ?? 9200;
            $hostString = sprintf('%s://%s:%s', $scheme, $host, $port);

            $client = ClientBuilder::create()->setHosts([$hostString])->build();

            // 2. 저장할 데이터 준비 (여기서는 더미 데이터 생성)
            //    실제 사용 시에는 $request 내용이나 다른 로직으로 데이터를 만듭니다.
            $dummyData = [
                'event_source' => 'laravel_api',
                'event_name' => 'dummy_data_added',
                'timestamp' => now()->toIso8601String(),
                'message' => 'User clicked the Add Data button.',
                'user_id' => auth()->id() ?? null, // 로그인 사용자 또는 임의 ID
                'random_value' => rand(1, 1000),
                'request_details' => [ // 요청 정보 일부 포함 (예시)
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]
            ];

            // 3. 인덱스 이름 지정
            $indexName = 'laravel_app_events'; // 이전에 정한 인덱스 이름

            // 4. index API 호출 파라미터 준비
            $params = [
                'index' => $indexName,
                // 'id' => Uuid::uuid4()->toString(), // UUID 사용 예시 (자동 생성하도록 비워둠)
                'body'  => $dummyData    // 저장할 더미 데이터
            ];

            // 5. Elasticsearch에 데이터 인덱싱 요청
            $response = $client->index($params);

            // 6. 결과 확인 및 성공 응답 반환
            if (isset($response['result']) && in_array($response['result'], ['created', 'updated'])) {
                Log::info('Dummy data successfully indexed to Elasticsearch', ['es_response' => $response]);
                // React(Axios) 요청에 성공 JSON 응답 반환
                return response()->json([
                    'message' => 'Dummy data successfully indexed!',
                    'document_id' => $response['_id'] ?? null // 생성된 문서 ID 포함
                ], 201); // 201 Created 상태 코드 사용
            } else {
                Log::warning('Elasticsearch indexing response unclear', ['es_response' => $response]);
                return response()->json(['message' => 'ES response unclear.', 'es_response' => $response], 500);
            }

        } catch (\Exception $e) {
            // 오류 발생 시 로그 남기고 오류 응답 반환
            Log::error('Error indexing data to Elasticsearch: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error indexing data to Elasticsearch',
                'error' => $e->getMessage()
            ], 500); // 500 Internal Server Error 상태 코드 사용
        }
    }

}
