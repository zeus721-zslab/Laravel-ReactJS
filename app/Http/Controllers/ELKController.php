<?php
namespace App\Http\Controllers;
use Inertia\Response;
use Inertia\Inertia;
// use Elasticsearch\ClientBuilder; // 원래 써야 하는 것 주석 처리
use Elastic\Elasticsearch\ClientBuilder; // 잘못된 맵에 맞춰서 임시로 사용


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
            $indexName = 'kibana_sample_data_ecommerce';

            // Elasticsearch 검색 쿼리 (예: 모든 데이터 10개 가져오기)
            $params = [
                'index' => $indexName,
                'body'  => [
                    'query' => [
                        'match_all' => new \stdClass() // 모든 문서 매칭 ({})
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

}
