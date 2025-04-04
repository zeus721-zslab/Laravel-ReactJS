// resources/js/Components/ImageUploadNotification.jsx
import React, { useState, useEffect } from 'react';
import { useSocket } from '@/Contexts/SocketContext';

const ImageUploadNotification = () => {
    const { socket } = useSocket();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (socket) {
            const handleImageUploaded = (data) => {
                setNotification({
                    imagePath: data.filePath,
                });
                setTimeout(() => {
                    setNotification(null);
                },2000);
            };

            socket.on('image_uploaded', handleImageUploaded);

            return () => {
                socket.off('image_uploaded', handleImageUploaded);
            };
        }
    }, [socket]);

    if (!notification) {
        return null; // 알림이 없을 때는 아무것도 렌더링하지 않습니다.
    }

    return (
        <>
            {/* PC 환경 */}
            <div className="hidden lg:block fixed top-5 right-5 bg-white border border-gray-300 shadow-md rounded-md p-4 w-1/2">
                <h2 className="text-lg font-semibold mb-2">알림</h2>
                <p className="text-sm">이미지 경로 : {notification.imagePath}</p>
            </div>

            {/* Mobile 환경 */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-300 shadow-md p-4 text-center">
                <h2 className="text-lg font-semibold mb-1">알림</h2>
                <p className="text-sm">이미지 경로 : {notification.imagePath}</p>
            </div>
        </>
    );
};

export default ImageUploadNotification;
