// 파일 경로: resources/js/Pages/Chat/Room.jsx
// 읽음 처리 UI 적용 완료 버전

import React, { useEffect, useState, useCallback } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useSocket } from '@/Contexts/SocketContext';
import { useMessages } from '@/Hooks/useMessages'; // 커스텀 훅 임포트
import { useChatRoomEvents } from '@/Hooks/useChatRoomEvents'; // 커스텀 훅 임포트

export default function Room({ auth, targetUser, roomId }) {
    const { socket } = useSocket();
    const [newMessage, setNewMessage] = useState(''); // 입력 필드 상태는 여기에 둠

    // --- useMessages 훅 호출 (메시지/히스토리/스크롤 관리) ---
    const {
        messages, setMessages, historyLoading, historyError, pagination,
        loadingMore, allHistoryLoaded, chatContainerRef, loadInitialMessages,
        loadMoreMessages, handleScroll
    } = useMessages(roomId, auth.user.id); // ★ auth.user.id 전달 확인

    // --- 스크롤 함수 ---
    const scrollToBottom = useCallback((smooth = true) => {
        if (chatContainerRef.current) {
            setTimeout(() => { // setTimeout 유지
                chatContainerRef.current?.scrollTo({
                    top: chatContainerRef.current.scrollHeight,
                    behavior: smooth ? 'smooth' : 'auto'
                });
                console.log('[Room] Scrolled to bottom.');
            }, 0);
        }
    }, [chatContainerRef]);

    // --- 초기 메시지 로딩 실행 ---
    useEffect(() => {
        // useMessages 훅에서 반환된 초기 로딩 함수 사용
        loadInitialMessages(scrollToBottom);
    }, [loadInitialMessages, scrollToBottom]);

    // --- useChatRoomEvents 훅 호출 (소켓 이벤트/메시지 전송/타이핑 관리) ---
    const {
        typingUsers, sendMessage, handleTypingChange
    } = useChatRoomEvents(roomId, socket, auth.user, setMessages, scrollToBottom); // ★ setMessages, scrollToBottom 전달 확인

    // --- 메시지 전송 폼 핸들러 ---
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const messageContent = newMessage.trim();
        if (!messageContent) return;

        setNewMessage(''); // 입력 필드 즉시 비우기
        const success = await sendMessage(messageContent); // 훅에서 반환된 함수 사용

        if (!success) {
            alert('메시지 전송에 실패했습니다.');
            setNewMessage(messageContent); // 실패 시 내용 복원
        }
        // 스크롤은 sendMessage 함수 내부 또는 이벤트 수신 시 처리됨
    };

    // --- 입력 변경 핸들러 ---
    const handleInputChange = (e) => {
        setNewMessage(e.target.value); // 로컬 상태 업데이트
        handleTypingChange();        // 훅 사용
    };

    // --- JSX ---
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Chat with {targetUser.name}</h2>}
        >
            <Head title={`Chat with ${targetUser.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg flex flex-col" style={{ height: '70vh' }}>

                        {/* 메시지 표시 영역 */}
                        <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 space-y-2">
                            {/* 로딩 상태 표시 */}
                            {loadingMore && ( <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">Loading more...</p> )}
                            {!loadingMore && allHistoryLoaded && messages.length > 0 && ( <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">No more messages.</p> )}
                            {historyLoading && ( <p className="text-center text-gray-500 dark:text-gray-400">Loading history...</p> )}
                            {historyError && ( <p className="text-center text-red-600 dark:text-red-400">{historyError}</p> )}

                            {/* 메시지 목록 렌더링 */}
                            {!historyLoading && !historyError && (
                                <>
                                    {messages.length > 0 ? (
                                        messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                // 읽음 처리 대상 지정을 위한 data 속성 (useMessages 훅 내부 로직에서 사용)
                                                {...(msg.user?.id !== auth.user.id && !msg.read_at ? { 'data-message-id': msg.id } : {})}
                                                className={`flex ${msg.user?.id === auth.user.id ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`py-2 px-3 rounded-lg max-w-[70%] lg:max-w-[60%] shadow ${msg.user?.id === auth.user.id ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'}`}>
                                                    {/* 상대방 메시지일 경우 보낸 사람 이름 표시 */}
                                                    {msg.user?.id !== auth.user.id && (
                                                        <p className="text-xs font-semibold mb-1 opacity-80">{msg.user?.name || 'User'}</p>
                                                    )}
                                                    {/* 메시지 내용 */}
                                                    <p className="text-sm break-words">{msg.content}</p>

                                                    {/* 시간 및 읽음 상태 표시 컨테이너 */}
                                                    <div className="flex items-center justify-between space-x-1 mt-1 text-xs opacity-75">
                                                        {/* 메시지 시간 */}
                                                        <span>
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>

                                                        {/* ★★★ 읽음 상태 표시 로직 (내가 보낸 메시지에만) ★★★ */}
                                                        {msg.user?.id === auth.user.id && (
                                                            <span className="inline-block text-end"> {/* 아이콘 컨테이너 */}
                                                                {msg.read_at ? (
                                                                    // 읽음 아이콘 (예: 파란색 더블 체크)
                                                                    <>
                                                                        읽음
                                                                    </>
                                                                ) :  (
                                                                    <>&nbsp;</>
                                                                ) }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 dark:text-gray-400"> No messages yet. Start the conversation! (Room ID: {roomId}) </p>
                                    )}
                                </>
                            )}
                        </div>

                        {/* 메시지 입력 폼 */}
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                            {/* 타이핑 표시기 */}
                            <div className="h-5 text-sm text-gray-500 dark:text-gray-400 italic mb-1">
                                {(() => {
                                    const typers = Object.entries(typingUsers)
                                        .filter(([id]) => id !== String(auth.user.id))
                                        .map(([id, name]) => name);
                                    if (typers.length === 1) return `${typers[0]} is typing...`;
                                    if (typers.length === 2) return `${typers[0]} and ${typers[1]} are typing...`;
                                    if (typers.length > 2) return 'Multiple users are typing...';
                                    return '\u00A0'; // nbsp
                                })()}
                            </div>
                            {/* 폼 */}
                            <form onSubmit={handleFormSubmit} className="flex space-x-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={handleInputChange}
                                    placeholder="Type your message..."
                                    className="flex-1 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm disabled:opacity-50"
                                    disabled={!socket?.connected}
                                    autoComplete="off"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-50 transition"
                                    disabled={!socket?.connected || !newMessage.trim()}
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
