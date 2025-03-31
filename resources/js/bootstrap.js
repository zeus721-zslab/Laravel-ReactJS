import axios from 'axios';
import {usePage} from "@inertiajs/react";
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

function AuthUser(){ return usePage().props.auth.user; }
window.AuthUser = AuthUser;
