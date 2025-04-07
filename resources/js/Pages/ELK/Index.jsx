import React from 'react';
// 레이아웃 컴포넌트를 사용한다면 import 하세요. (예: AuthenticatedLayout)
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// Controller에서 전달한 'hits'와 'error' props를 받습니다.
export default function Index({ hits, error , auth }) {

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
