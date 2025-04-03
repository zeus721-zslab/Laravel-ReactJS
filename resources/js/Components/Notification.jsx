import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { usePage } from '@inertiajs/react';

function Notification() {
    const [notification, setNotification] = useState(null);
    const { appUrl, auth } = usePage().props; // auth 속성에서 사용자 정보 접근
    const ENDPOINT = appUrl; // 또는 `${appUrl}/socket.io`

    useEffect(() => {
        // 현재 로그인한 사용자 ID를 쿼리 파라미터로 전달
        const userId = auth?.user?.id;
        const socket = socketIOClient(ENDPOINT, {
            query: { userId: userId }
        });

        socket.on("connect", () => {
            console.log('SocketIO 클라이언트 연결됨 (Notification):', socket.id, new Date());
        });

        socket.on("image_uploaded", data => {
            console.log("서버로부터 알림 도착 (Notification 컴포넌트):", data, new Date());
            setNotification(data);
        });

        socket.on('connect_error', (error) => {
            console.error('Connection Error:', error);
        });

        return () => socket.disconnect();
    }, []); // 의존성 배열 비움 (초기 연결만 수행)

    return (
        <>
            {notification && (
                <div /* ... 알림 스타일 ... */ >
                    새로운 이미지 업로드: {notification.filePath} (사용자 ID: {notification.userId})
                </div>
            )}
        </>
    );
}

export default Notification;
