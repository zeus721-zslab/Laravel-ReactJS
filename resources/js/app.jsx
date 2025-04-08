// resources/js/app.jsx (다시 확인)
import '../css/app.css';
import './bootstrap';

import {createInertiaApp} from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { SocketProvider } from './Contexts/SocketContext'; // SocketProvider 임포트 확인

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            // 이 부분이 Pages 폴더의 컴포넌트를 로드합니다.
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <SocketProvider>
                <App {...props} />
            </SocketProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
