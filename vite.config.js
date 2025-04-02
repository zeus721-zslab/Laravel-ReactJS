import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    console.log(command);
    console.log(mode === 'development' ? env.SANCTUM_STATEFUL_DOMAINS_STG : env.SANCTUM_STATEFUL_DOMAINS);
    console.log(mode === 'development' ? parseInt(env.VITE_APP_STG_PORT) : parseInt(env.VITE_APP_PORT));

    return {
        server: {
            http : mode === 'development',
            https: mode !== 'development', // HTTPS 옵션 객체 전달
            host: '0.0.0.0',
            hmr: {
                host: mode === 'development' ? env.SANCTUM_STATEFUL_DOMAINS_STG : env.SANCTUM_STATEFUL_DOMAINS,
                protocol: mode === 'development' ? 'ws' : 'wss' ,
                port: mode === 'development' ? parseInt(env.VITE_APP_STG_PORT) : parseInt(env.VITE_APP_PORT),
            },
            port: mode === 'development' ? parseInt(env.VITE_APP_STG_PORT) : parseInt(env.VITE_APP_PORT),
        },
        plugins: [
            laravel({
                input: 'resources/js/app.jsx',
                refresh: true,
            }),
            react(),
        ],
    };
});
