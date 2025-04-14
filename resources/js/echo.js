// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js'; // pusher-js 임포트 확인
// window.Pusher = Pusher;
//
// // ★★★ 환경 변수 확인용 로그 추가 ★★★
// console.log('VITE_REVERB_APP_KEY:', import.meta.env.VITE_REVERB_APP_KEY);
// console.log('VITE_REVERB_HOST:', import.meta.env.VITE_REVERB_HOST);
// console.log('VITE_REVERB_PORT:', import.meta.env.VITE_REVERB_PORT);
// console.log('VITE_REVERB_SCHEME:', import.meta.env.VITE_REVERB_SCHEME);
// // ★★★ 여기까지 추가 ★★★
//
// window.Echo = new Echo({
//     broadcaster: 'pusher', // ★★★ 'pusher' 로 변경 ★★★
//     key: import.meta.env.VITE_REVERB_APP_KEY,
//     wsHost: import.meta.env.VITE_REVERB_HOST,
//     cluster: '',
//     // wsPort: import.meta.env.VITE_REVERB_PORT ?? 80, // 아래 수정 제안 참고
//     // wssPort: import.meta.env.VITE_REVERB_PORT ?? 443, // 아래 수정 제안 참고
//     // forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https', // 아래 수정 제안 참고
//     // enabledTransports: ['ws', 'wss'], // 아래 수정 제안 참고
//
//     // --- 아래처럼 수정하는 것을 권장 ---
//     wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080, // 기본값 8080 명시
//     wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080, // 기본값 8080 명시 (TLS 사용 시)
//     forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https', // .env 기본값 http 고려
//     enabledTransports: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https' ? ['ws', 'wss'] : ['ws'], // http면 ws만 사용
//     // authEndpoint: '/broadcasting/auth', // 기본값 사용 시 생략 가능
// });
