// src/Contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import socketIOClient from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children , endpoint }) => {
    const SOCKET_URL  = endpoint+':3001';
    const [socket, setSocket] = useState(null);
    const [socketId, setSocketId] = useState(null);

    const joinRoom = useCallback((userId) => {
        if (socket && userId) {
            console.log('Emitting join_room from context with userId:', userId);
            socket.emit('join_room', userId);
        }
    }, [socket]);

    useEffect(() => {
        const newSocket = socketIOClient(SOCKET_URL,{ // <-- 옵션 객체 추가 test
            withCredentials: true // <-- 이 옵션 추가!
        });
        console.log('Socket connected:', newSocket.id);

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            setSocket(newSocket);
            setSocketId(newSocket.id);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setSocket(null);
            setSocketId(null);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        return () => {
            console.log('Disconnecting socket...');
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, socketId, joinRoom }}>
            {children}
        </SocketContext.Provider>
    );
};
