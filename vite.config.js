import { defineConfig , loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

const env = loadEnv(mode, process.cwd(), '');


export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        server: {
            https: false,  // HTTPS 비활성화
            host: '0.0.0.0',  // 모든 IP에서 Vite 서버에 접근 가능하도록 설정
            hmr: {
                host: mode === 'development' ? env.SANCTUM_STATEFUL_DOMAINS_STG : env.SANCTUM_STATEFUL_DOMAINS,  // HMR 엔드포인트
                protocol: 'ws',  // WebSocket 프로토콜 사용
                port: mode === 'development' ? env.VITE_APP_PORT : env.VITE_APP_STG_PORT,  // HMR 포트 설정
            },
            port: mode === 'development' ? env.VITE_APP_PORT : env.VITE_APP_STG_PORT,

        },
        plugins: [
            laravel({
                input: 'resources/js/app.jsx',
                refresh: true,
            }),
            react(),
        ],

    }

});
/*
export default defineConfig({
    server: {
        https: false,  // HTTPS 비활성화
        host: '0.0.0.0',  // 모든 IP에서 Vite 서버에 접근 가능하도록 설정
        hmr: {
            host: 'zslab-stg.duckdns.org',  // HMR 엔드포인트
            protocol: 'ws',  // WebSocket 프로토콜 사용
            port: 5174,  // HMR 포트 설정
        },
        port: 5174,

    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
});

*/
