import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        https: false,  // HTTPS 비활성화
        host: '0.0.0.0',  // 모든 IP에서 Vite 서버에 접근 가능하도록 설정
        hmr: {
            host: 'zslab.duckdns.org',  // HMR 엔드포인트
            protocol: 'ws',  // WebSocket 프로토콜 사용
            port: 5173,  // HMR 포트 설정
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
});

