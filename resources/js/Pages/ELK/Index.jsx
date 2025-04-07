import React, { useState } from 'react'; // useState 추가
// 레이아웃 컴포넌트를 사용한다면 import 하세요. (예: AuthenticatedLayout)
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head , router } from '@inertiajs/react';

// Controller에서 전달한 'hits'와 'error' props를 받습니다.
export default function Index({ hits, error , auth }) {

    // 로딩 상태 관리를 위한 state 추가
    const [isLoading, setIsLoading] = useState(false);
    // 요청 결과 메시지 표시용 state 추가 (선택 사항)
    const [message, setMessage] = useState('');

    // 버튼 클릭 시 실행될 함수 (2단계에서 구현 예정)
    // 버튼 클릭 시 실행될 함수 수정
    const handleAddDataClick = async () => {
        setIsLoading(true); // 로딩 시작
        setMessage(''); // 이전 메시지 초기화

        try {
            // Laravel API 엔드포인트(/api/elk/add-data)로 POST 요청 전송
            // 두 번째 인자는 요청 본문(body)이지만, 이번에는 빈 객체{} 전송
            const response = await axios.post('/ELK/add-data', {});
            console.log('API Response:', response.data);
            setMessage('데이터 추가 요청 성공! 목록을 갱신합니다...');

            // --- ★★★ 데이터 추가 성공 후 Inertia 데이터 리로드 ★★★ ---
            setTimeout(() => {
                router.reload({ // 최신 Inertia 방식 (import { router } from '@inertiajs/react';)
                    only: ['hits', 'error'], // 'hits' prop과 'error' prop만 새로고침
                    preserveState: true, // 현재 컴포넌트의 다른 로컬 state 유지
                    preserveScroll: true, // 현재 스크롤 위치 유지
                    onSuccess: () => { // 리로드 성공 시 메시지 업데이트
                        setMessage('데이터 추가 및 목록 갱신 완료!');
                    },
                    onError: (errors) => { // 리로드 중 오류 발생 시
                        setMessage('목록 갱신 중 오류가 발생했습니다.');
                        console.error('Inertia reload errors:', errors);
                    },
                    onFinish: () => { // 리로드 완료 시 (성공/실패 무관) 로딩 종료
                        setIsLoading(false);
                    }
                });
            },500);
            // --- 리로드 로직 끝 ---

        } catch (err) {
            // 요청 실패 시
            console.error('API Error:', err);
            let errorMessage = '데이터 추가 요청 실패.';
            if (err.response) {
                // 서버에서 오류 응답(4xx, 5xx)을 보낸 경우
                errorMessage += ` Status: ${err.response.status} - ${err.response.data?.message || err.message}`;
            } else if (err.request) {
                // 요청은 보냈으나 응답을 받지 못한 경우 (네트워크 오류 등)
                errorMessage += ' 서버에서 응답이 없습니다.';
            } else {
                // 요청 설정 중 오류 발생
                errorMessage += ` ${err.message}`;
            }
            setMessage(errorMessage); // 오류 메시지 설정
        } finally {
            setIsLoading(false); // 로딩 종료 (성공/실패 여부와 관계없이)
        }
    };

    return (
        // 레이아웃 컴포넌트를 사용한다면 <AuthenticatedLayout> 등으로 감싸줍니다.
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Elasticsearch Data</h2>}
        >
            <Head title="Elasticsearch Data" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            <h1 className="text-2xl font-bold mb-4">Elasticsearch Sample Data</h1>

                            <div className="mb-4">
                                <button
                                    onClick={handleAddDataClick}
                                    // 로딩 중일 때 버튼 비활성화
                                    disabled={isLoading}
                                    className={`px-4 py-2 bg-blue-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                                        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                                    }`}
                                >
                                    {/* 로딩 상태에 따라 버튼 텍스트 변경 */}
                                    {isLoading ? '요청 중...' : '더미 데이터 추가 (Send to ELK)'}
                                </button>
                            </div>

                            {/* 요청 결과 메시지 표시 */}
                            {message && (
                                <div className={`mb-4 px-4 py-2 rounded text-sm ${message.includes('실패') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {message}
                                </div>
                            )}

                            {/* 오류가 있을 경우 오류 메시지 표시 */}
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                    <strong className="font-bold">Error:</strong>
                                    <span className="block sm:inline"> {error}</span>
                                </div>
                            )}

                            {/* 오류가 없고 데이터가 있을 경우 */}
                            {!error && hits && hits.length > 0 && (
                                <div>
                                    <p className="mb-2">Showing {hits.length} documents:</p>
                                    {/* hits 배열을 순회하며 각 문서를 표시 */}
                                    {hits.map((hit) => (
                                        <div key={hit._id} className="mb-4 p-4 border rounded">
                                            {/* 문서 ID 표시 */}
                                            <h3 className="text-lg font-semibold mb-2">Document ID: {hit._id}</h3>
                                            {/* _source 내용을 JSON 문자열로 변환하여 pre 태그로 보기 좋게 표시 */}
                                            <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-sm">
                                                {JSON.stringify(hit._source, null, 2)}
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 오류도 없고 데이터도 없을 경우 */}
                            {!error && (!hits || hits.length === 0) && (
                                <p>No data found.</p>
                            )}

                        </div>
                    </div>
                </div>
            </div>
            {/* 레이아웃 컴포넌트를 사용한다면 </AuthenticatedLayout> 등으로 닫아줍니다. */}
        </AuthenticatedLayout>
    );
}
