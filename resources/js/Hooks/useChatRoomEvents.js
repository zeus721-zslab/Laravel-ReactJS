// 파일 경로: resources/js/hooks/useChatRoomEvents.js
// 'message.read' 이벤트 리스너 추가 완료 버전

import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
// route 함수 사용을 위해 필요하다면 import 필요 (예: import route from 'ziggy-js';)

export function useChatRoomEvents(roomId, socket, authUser, setMessages, scrollToBottom) {
    const [typingUsers, setTypingUsers] = useState({});
    const typingTimeoutRef = useRef(null);
    const userTypingTimeoutsRef = useRef({});

    // --- Socket Room Join/Leave Effect ---
    useEffect(() => {
        if (socket && roomId) {
            console.log(`[useChatEvents] Joining Socket Room: ${roomId}`);
            socket.emit('join_chat_room', roomId);
            // 사용자별 룸에도 참여 (기존 NotificationHandler 등에서 처리했다면 이관 또는 중복 확인 필요)
            if (authUser?.id) {
                console.log(`[useChatEvents] Joining user Room: user_${authUser.id}`);
                socket.emit('join_user_channel', authUser.id); // 혹은 다른 이벤트 이름 사용
            }
            return () => {
                console.log(`[useChatEvents] Leaving Socket Room: ${roomId}`);
                socket.emit('leave_chat_room', roomId);
                // 사용자별 룸 나가기 로직도 필요 시 추가
                Object.values(userTypingTimeoutsRef.current).forEach(clearTimeout);
                userTypingTimeoutsRef.current = {};
                if(typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            };
        } else { console.warn('[useChatEvents] Socket/roomId/authUser not ready for join/leave effect.'); }
        // authUser 추가 (사용자 룸 조인 위함)
    }, [socket, roomId, authUser?.id]);

    // --- New Message Listener Effect ---
    useEffect(() => {
        // socket, roomId, setMessages, scrollToBottom 유효성 검사
        if (socket && roomId && typeof setMessages === 'function' && typeof scrollToBottom === 'function') {
            const messageListener = (messageData) => {
                console.log('[useChatEvents] newMessage received:', messageData);
                // 메시지 데이터 구조 및 유효성 검사 강화
                if (messageData?.room_id === roomId && messageData?.id && messageData.user) {
                    setMessages(prevMessages => {
                        if (!Array.isArray(prevMessages)) {
                            console.error("[useChatEvents] Invalid prevMessages state: not an array.");
                            return []; // 비정상 상태일 경우 초기화 또는 오류 처리
                        }
                        if (prevMessages.some(msg => msg.id === messageData.id)) {
                            console.log(`[useChatEvents] Duplicate message ID ${messageData.id}. Skipping.`);
                            return prevMessages;
                        }
                        console.log('[useChatEvents] New unique message. Appending.');
                        // 불변성 유지하며 새 메시지 추가
                        const newMessages = [...prevMessages, messageData];
                        // 현재 사용자가 보낸 메시지가 아닐 때만 스크롤 (옵션)
                        // if (messageData.user_id !== authUser?.id) {
                        //     scrollToBottom();
                        // }
                        // 또는 항상 스크롤
                        scrollToBottom();
                        return newMessages;
                    });
                } else { console.log('[useChatEvents] Message ignored (roomId mismatch or invalid data).'); }
            };
            console.log(`[useChatEvents] Registering 'newMessage' listener for room ${roomId}.`);
            socket.on('newMessage', messageListener);
            return () => { console.log(`[useChatEvents] Cleaning up 'newMessage' listener for room ${roomId}.`); socket.off('newMessage', messageListener); };
        }
    }, [socket, roomId, setMessages, scrollToBottom, authUser?.id]); // authUser?.id 추가

    // --- Typing Listeners Effect ---
    useEffect(() => {
        if (socket && roomId && authUser?.id) {
            const handleUserTyping = (data) => {
                console.log('[useChatEvents] user_typing received:', data);
                if (data.roomId === roomId && data.userId !== authUser.id) {
                    const { userId, userName } = data;
                    // 이전 타임아웃 클리어
                    if (userTypingTimeoutsRef.current[userId]) clearTimeout(userTypingTimeoutsRef.current[userId]);
                    // 새 타임아웃 설정 및 상태 업데이트
                    setTypingUsers(prev => ({ ...prev, [userId]: userName || `User_${userId}` }));
                    userTypingTimeoutsRef.current[userId] = setTimeout(() => {
                        console.log(`[useChatEvents] Typing timeout for user: ${userId}`);
                        setTypingUsers(prev => {
                            const newState = { ...prev };
                            delete newState[userId];
                            return newState;
                        });
                        delete userTypingTimeoutsRef.current[userId];
                    }, 3000); // 3초
                }
            };
            const handleUserStoppedTyping = (data) => {
                console.log('[useChatEvents] user_stopped_typing received:', data);
                if (data.roomId === roomId && data.userId !== authUser.id) { // 자신의 멈춤 이벤트는 무시
                    const { userId } = data;
                    if (userTypingTimeoutsRef.current[userId]) {
                        clearTimeout(userTypingTimeoutsRef.current[userId]);
                        delete userTypingTimeoutsRef.current[userId];
                    }
                    setTypingUsers(prev => {
                        const newState = { ...prev };
                        delete newState[userId];
                        return newState;
                    });
                }
            };

            console.log(`[useChatEvents] Registering typing listeners for room ${roomId}.`);
            socket.on('user_typing', handleUserTyping);
            socket.on('user_stopped_typing', handleUserStoppedTyping);

            return () => {
                console.log(`[useChatEvents] Cleaning up typing listeners for room ${roomId}.`);
                socket.off('user_typing', handleUserTyping);
                socket.off('user_stopped_typing', handleUserStoppedTyping);
                // 모든 진행중인 타임아웃 클리어
                Object.values(userTypingTimeoutsRef.current).forEach(clearTimeout);
                userTypingTimeoutsRef.current = {};
            };
        }
    }, [socket, roomId, authUser?.id]); // 의존성 확인


    // --- ★★★ Message Read Listener Effect 추가 ★★★ ---
    useEffect(() => {
        // socket, setMessages, authUser 가 모두 유효할 때 리스너 등록
        if (socket && typeof setMessages === 'function' && authUser?.id) {

            const messageReadHandler = (data) => {
                // 이벤트 수신 확인 로그
                console.log('[React] Received message.read event:', data);

                // 데이터 유효성 검사 (messageIds가 배열인지 등)
                if (!data || !Array.isArray(data.messageIds) || data.messageIds.length === 0) {
                    console.error('[React] Invalid message.read data received:', data);
                    return;
                }

                // setMessages 함수를 사용하여 messages 상태 업데이트
                setMessages(prevMessages => {
                    if (!Array.isArray(prevMessages)) {
                        console.error("[useChatEvents - Read Handler] Invalid prevMessages state: not an array.");
                        return [];
                    }
                    // map을 사용하여 새로운 배열 반환 (불변성 유지)
                    return prevMessages.map(msg => {
                        // 조건: 내가 보낸 메시지인가? + 이벤트 데이터에 포함된 ID인가? + 아직 안 읽음 상태인가?
                        if (msg.user?.id === authUser.id && data.messageIds.includes(msg.id) && !msg.read_at) {
                            console.log(`[React] Updating read_at for message ${msg.id} to ${data.readAt}`);
                            // 메시지 객체를 복사하고 read_at 속성 업데이트
                            return { ...msg, read_at: data.readAt || new Date().toISOString() };
                        }
                        // 조건에 맞지 않으면 기존 메시지 객체 그대로 반환
                        return msg;
                    });
                });
            };

            // 소켓 이벤트 리스너 등록
            const eventName = 'message.read'; // 이벤트 이름 명시
            console.log(`[useChatEvents] Registering "${eventName}" listener.`);
            socket.on(eventName, messageReadHandler);

            // Cleanup 함수: 컴포넌트 언마운트 시 또는 의존성 변경 시 리스너 제거
            return () => {
                console.log(`[useChatEvents] Cleaning up "${eventName}" listener.`);
                socket.off(eventName, messageReadHandler);
            };
        }
    }, [socket, setMessages, authUser]); // ★ 의존성 배열: socket, setMessages, authUser ★


    // --- Send Message Function ---
    const sendMessage = useCallback(async (messageContent) => {
        // socket, roomId, setMessages, scrollToBottom 유효성 검사 추가 가능
        if (!messageContent || !socket || !roomId || typeof setMessages !== 'function' || typeof scrollToBottom !== 'function') {
            console.error("[sendMessage] Invalid arguments or socket/room not ready.");
            return false;
        }

        try {
            console.log(`[useChatEvents] Sending message via API:`, { roomId, message: messageContent });
            // route 함수 사용 확인 필요
            const response = await axios.post(route('chat.messages.store'), {
                roomId: roomId,
                message: messageContent
            });
            const savedMessageData = response.data;
            // API 응답 데이터 구조 검증 추가 권장
            if (!savedMessageData || !savedMessageData.id) {
                console.error("[sendMessage] Invalid data received from API:", savedMessageData);
                throw new Error("Invalid message data from server.");
            }
            console.log('[useChatEvents] Message saved via API:', savedMessageData);

            // 옵티미스틱 업데이트 대신 API 성공 후 상태 업데이트
            setMessages(prevMessages => [...prevMessages, savedMessageData]);
            scrollToBottom(); // 상태 업데이트 후 스크롤

            console.log(`[useChatEvents] Emitting 'send_message':`, savedMessageData);
            socket.emit('send_message', savedMessageData); // 저장된 전체 메시지 데이터 전송
            return true;

        } catch (error) {
            console.error("[useChatEvents] Failed to send message via API:", error);
            alert('메시지 전송에 실패했습니다.');
            // 실패 시 UI 롤백 로직은 현재 없음
            return false;
        }
    }, [socket, roomId, setMessages, scrollToBottom]); // route 함수 전역 가정

    // --- Handle Typing Change (emit events) ---
    const handleTypingChange = useCallback(() => {
        if (socket && roomId) {
            // console.log("[useChatEvents] Emitting 'typing_start'"); // 필요시 로그 활성화
            socket.emit('typing_start', { roomId });
            // 이전 타임아웃 클리어
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            // 새 타임아웃 설정
            typingTimeoutRef.current = setTimeout(() => {
                if (socket && roomId) {
                    // console.log("[useChatEvents] Emitting 'typing_stop' after timeout"); // 필요시 로그 활성화
                    socket.emit('typing_stop', { roomId });
                }
                typingTimeoutRef.current = null; // 타임아웃 ID 초기화
            }, 1500); // 1.5초
        }
    }, [socket, roomId]);

    // --- 반환 객체 ---
    return {
        typingUsers,
        sendMessage,
        handleTypingChange,
    };
}
