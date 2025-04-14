// SocketContext.jsx 수정 예시
// React 및 필요한 훅들을 모두 import 합니다.
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'; // <-- 여기에 useCallback 포함 확인!
import socketIOClient from 'socket.io-client';

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children , user }) => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
    const [socket, setSocket] = useState(null);
    const [socketId, setSocketId] = useState(null);

    // 사용자 알림 채널 참여 함수 (이름 변경 및 useCallback 적용 권장)
    const joinUserChannel = useCallback((userId) => {
        if (socket && userId) {
            console.log('[SocketContext] Emitting join_user_channel:', userId);
            socket.emit('join_user_channel', userId); // 이벤트 이름 통일
        }
    }, [socket]);

    useEffect(() => {
        console.log('[SocketContext] Attempting to connect to:', SOCKET_URL);

        if (user?.id) {
            console.log('[SocketContext] Attempting to connect with auth userId:', user.id);

            const newSocket = socketIOClient(SOCKET_URL, {
                withCredentials: true,
                auth: {
                    userId: user.id
                }
                // transports: ['websocket', 'polling'] // 필요 시 명시
            });

            newSocket.on('connect', () => {
                console.log('[SocketContext] Socket connected:', newSocket.id);
                setSocket(newSocket); // 상태 업데이트
                setSocketId(newSocket.id);
            });

            newSocket.on('disconnect', (reason) => {
                console.log('[SocketContext] Socket disconnected:', reason);
                setSocket(null); // 상태 업데이트
                setSocketId(null);
            });

            newSocket.on('connect_error', (err) => {
                console.error('[SocketContext] Socket connection error:', err.message);
            });

            // 컴포넌트 언마운트 시 소켓 연결 해제
            return () => {
                console.log('[SocketContext] Disconnecting socket...');
                newSocket.disconnect();
            };
        } else {
            // 사용자 정보 없을 시 연결 시도 안 함 (또는 연결 해제 처리)
            console.log('[SocketContext] User not available, socket connection deferred.');
            if(socket) { // 이미 연결된 소켓이 있다면 해제
                socket.disconnect();
            }
        }
    }, [SOCKET_URL , user]); // SOCKET_URL이 변경되지 않는다면 [] 로 해도 무방

    // *** Context Value 메모이제이션 ***
    const contextValue = useMemo(() => ({
        socket,
        socketId,
        joinUserChannel // 컨텍스트 통해 함수 제공 시
    }), [socket, socketId, joinUserChannel]); // 의존성 배열: socket, socketId, joinUserChannel이 변경될 때만 객체 재생성
    // ***********************************

    console.log('[SocketContext] Provider rendering. Socket connected:', !!socket);
    return (
        <SocketContext.Provider value={contextValue}> {/* 메모이제이션된 값 사용 */}
            {children}
        </SocketContext.Provider>
    );
};
