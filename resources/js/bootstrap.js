import axios from 'axios';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true; // 중요: 쿠키 기반 인증 시 필요
window.axios.defaults.withXSRFToken = true; // 중요: CSRF 보호 시 필요 (Laravel 11+)
