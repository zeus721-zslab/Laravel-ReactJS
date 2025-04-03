import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = "http://zslab-stg.duckdns.org";

function Notification() {
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);

        socket.on("connect", () => {
            console.log('SocketIO 클라이언트 연결됨 (Notification):', socket.id, new Date());
        });

        socket.on("image_uploaded", data => {
            console.log("서버로부터 알림 도착 (Notification 컴포넌트):", data, new Date());
            setNotification(data);

            setTimeout(() => {
                setNotification(null);
            }, 5000);
        });

        socket.on('connect_error', (error) => {
            console.error('Connection Error:', error);
        });

        return () => socket.disconnect();
    }, []);

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
