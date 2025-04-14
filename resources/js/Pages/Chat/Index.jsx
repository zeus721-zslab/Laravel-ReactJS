import React from 'react'; // useState, useEffect는 이제 필요 없습니다.
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // AuthenticatedLayout 사용
import { Head, Link } from '@inertiajs/react'; // Inertia의 Head와 Link 컴포넌트 import

// Controller에서 전달한 'auth', 'chatUsers' props를 직접 받습니다.
export default function Index({ auth, chatUsers }) {

    console.log(chatUsers);

    return (
        <AuthenticatedLayout
            user={auth.user}
            // 다크 모드를 고려하여 텍스트 색상 클래스 추가 (예: dark:text-gray-200)
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Chat Users</h2>}
        >
            <Head title="Chat" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* 다크 모드를 고려한 배경색 및 텍스트 색상 (예: dark:bg-gray-800, dark:text-gray-100) */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 mb-4">
                                Select a user to chat with:
                            </h3>

                            {/* chatUsers prop이 존재하고 배열인지 확인 */}
                            {chatUsers && Array.isArray(chatUsers) ? (
                                // 사용자 목록이 비어 있는지 확인
                                chatUsers.length > 0 ? (
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {/* chatUsers 배열을 매핑하여 각 사용자 표시 */}
                                        {chatUsers.map((user) => (
                                            <li key={user.id} className="py-4 flex items-center justify-between space-x-3">
                                                {/* 사용자 정보 */}
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                {/* 채팅 시작 버튼/링크 */}
                                                <Link
                                                    // Laravel의 route() 헬퍼와 Ziggy 라이브러리가 설정되었다면 route() 사용 권장
                                                    href={route('chat.room', { user: user.id })}
                                                    // Ziggy 설정이 없다면 수동으로 경로 구성
                                                    // href={`/chat/with/${user.id}`}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition"
                                                >
                                                    Chat
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    // 사용자가 없을 경우 메시지 표시
                                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                                        No other users found.
                                    </p>
                                )
                            ) : (
                                // chatUsers prop이 없거나 배열이 아닐 경우 (오류 또는 데이터 없음)
                                <p className="text-center text-red-600 dark:text-red-400 py-4">
                                    Could not load user list.
                                </p>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
