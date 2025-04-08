import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    console.log(command);
    console.log(env.SANCTUM_STATEFUL_DOMAINS);
    console.log(env.VITE_APP_PORT);

    return {
        server: {
            http : mode === 'staging' || mode === 'development',
            https: mode === 'production' , // HTTPS 옵션 객체 전달
            host: '0.0.0.0',
            hmr: {
                host: env.SANCTUM_STATEFUL_DOMAINS,
                protocol: env.HMR_PROTOCOL ,
                port: env.VITE_APP_PORT,
            },
            port: env.VITE_APP_PORT,
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
