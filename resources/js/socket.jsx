// src/socket.js
import socketIOClient from 'socket.io-client';

const setupSocketConnection = (appUrl, userId, dispatch) => {
    const socket = socketIOClient(appUrl, { query: { userId } });

    socket.on('connect', () => console.log('Socket connected from socket.js'));

    socket.on('message', (data) => {
        // Context API 액션 dispatch 예시
        dispatch({ type: 'ADD_MESSAGE', payload: data });
    });

    socket.on('image_uploaded', (data) => {
        dispatch({ type: 'IMAGE_UPLOADED', payload: data });
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error from socket.js:', error);
    });

    return socket;
};

export default setupSocketConnection;
