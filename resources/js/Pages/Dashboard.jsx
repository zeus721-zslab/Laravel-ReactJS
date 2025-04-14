import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // 기본 인증 레이아웃 컴포넌트를 가져옵니다. (로그인 상태 등 처리)
import { Head } from '@inertiajs/react'; // Inertia.js의 Head 컴포넌트를 가져옵니다. 페이지 <head> 태그 관리에 사용됩니다.
import React, { useState } from 'react';

// Dashboard 컴포넌트를 정의합니다. Laravel 백엔드에서 전달된 props (laravelVersion, phpVersion, deploymentTime)를 받습니다.
export default function Dashboard({ laravelVersion, phpVersion, deploymentTime }) {

    // SVG 아이콘을 JSX 변수로 정의합니다. 외부 링크 아이콘입니다.
    const svgIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="15" // 아이콘 가로 크기 설정
            height="15" // 아이콘 세로 크기 설정
            style={{ display: 'inline-block' }} // 인라인 요소로 표시되도록 스타일 설정
        >
            {/* SVG 경로 데이터: 외부 링크 아이콘 모양 */}
            <path d="M15 10v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"></path>
            <polyline points="12 3 18 3 18 9"></polyline>
            <line x1="8" y1="11" x2="18" y2="3"></line>
        </svg>
    );

    // 공개 GitHub 저장소 URL을 상수로 정의합니다.
    const LaravelRepositoryUrl = 'https://github.com/zeus721-zslab/Laravel-ReactJS';
    const NodeJsRepositoryUrl = 'https://github.com/zeus721-zslab/laravel_nodejs';

    // 아코디언 상태 관리를 위한 state (false: 닫힘, true: 열림)
    const [isChatAccordionOpen, setIsChatAccordionOpen] = useState(false);

    // 버튼 클릭 시 아코디언 상태를 토글하는 함수
    const toggleChatAccordion = () => {
        setIsChatAccordionOpen(!isChatAccordionOpen);
    };
    // 아코디언 내부에 표시될 기술 스택 요약 데이터
    const chatTechStack = [
        { category: '프론트엔드', techs: 'React.js, Socket.IO Client' },
        { category: '실시간 서버', techs: 'Node.js, Socket.IO Server' },
        { category: '백엔드 앱', techs: 'Laravel (PHP)' },
        { category: '메시지 브로커', techs: 'Redis (Pub/Sub)' },
        { category: '데이터베이스', techs: 'MariaDB' },
        { category: '인프라', techs: 'Nginx, Docker, GitHub Actions' },
    ];
    // --- 프로세스 요약 데이터 추가 ---
    const chatProcess = [
        '연결: 클라이언트(React) ↔ WebSocket ↔ 서버(Node.js/Socket.IO) (Nginx 경유 가능)',
        '메시지 송신: 클라이언트 → Node.js → (Laravel API) → DB 저장 → Redis 발행',
        '메시지 수신: Node.js (Redis 구독) → Socket.IO 브로드캐스트 → 다른 클라이언트 수신/표시',
        '읽음 처리: 클라이언트 → 서버(API/Socket) → DB 업데이트 → (실시간 전파)',
    ];
    // --- 프로세스 요약 데이터 끝 ---

    // 컴포넌트가 렌더링할 JSX를 반환합니다.
    return (
        // AuthenticatedLayout 컴포넌트로 전체 내용을 감쌉니다.
        <AuthenticatedLayout
            // header prop으로 페이지 헤더에 표시될 내용을 전달합니다.
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            {/* Inertia Head 컴포넌트를 사용하여 브라우저 탭의 제목을 "Dashboard"로 설정합니다. */}
            <Head title="Dashboard" />

            {/* 페이지 메인 컨텐츠 영역 시작 */}
            <div className="py-12"> {/* 상하 패딩 */}
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8"> {/* 최대 너비 설정 및 좌우 패딩 (반응형) */}
                    {/* 첫 번째 정보 카드 */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg"> {/* 흰색 배경, 그림자, 둥근 모서리 스타일 */}
                        <div className="p-6 text-gray-900"> {/* 카드 내부 패딩 및 기본 텍스트 색상 */}

                            {/* 공개 저장소 링크 */}
                            <a
                                href={LaravelRepositoryUrl} // 링크 URL
                                target="_blank" // 새 탭에서 열기
                                rel="noopener noreferrer" // 보안 및 성능 향상을 위한 속성
                                // Tailwind CSS 클래스를 이용한 스타일링 (둥근 모서리, 패딩, 텍스트 색상, 포커스 효과, 다크모드 등)
                                className="rounded-md py-3 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                            >
                                Laravel Public Repository&nbsp;{svgIcon} {/* 링크 텍스트와 SVG 아이콘 표시 */}
                            </a>
                            <a
                                href={NodeJsRepositoryUrl} // 링크 URL
                                target="_blank" // 새 탭에서 열기
                                rel="noopener noreferrer" // 보안 및 성능 향상을 위한 속성
                                // Tailwind CSS 클래스를 이용한 스타일링 (둥근 모서리, 패딩, 텍스트 색상, 포커스 효과, 다크모드 등)
                                className="rounded-md py-3 ms-5 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                            >
                                NodeJS Public Repository&nbsp;{svgIcon} {/* 링크 텍스트와 SVG 아이콘 표시 */}
                            </a>

                            <div className="mt-4 border"></div>
                            {/* 시스템 구성 정보 섹션 */}
                            <h5 className="mt-4 font-bold">@System Configure</h5> {/* 섹션 제목 */}
                            <ul className="mt-4 ps-5 flex flex-col gap-2 md:gap-1"> {/* 위쪽 마진, 디스크 불릿, 왼쪽 패딩을 가진 순서 없는 목록 */}
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">
                                    <label
                                        className="font-bold md:after:content-[':'] after:w-3 after:inline-block after:text-center">Docker</label>
                                    <span>Docker version 28.0.1</span>
                                </li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">
                                    <label
                                        className="font-bold md:after:content-[':'] after:w-3 after:inline-block after:text-center">Docker-compose</label>
                                    <span>docker-compose version 1.29.2</span>
                                </li>
                                {/* PHP 버전을 props에서 받아 동적으로 표시 */}
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">
                                    <label
                                        className="font-bold md:after:content-[':'] after:w-3 after:inline-block after:text-center">Web
                                        Application</label>
                                    <span>PHP {phpVersion} - <b>Container</b></span>
                                </li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">
                                    <label
                                        className="font-bold md:after:content-[':'] after:w-3 after:inline-block after:text-center">Socket
                                        Application</label>
                                    <span>NodeJS Express - <b>Container</b></span>
                                </li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">
                                    <label
                                        className="font-bold md:after:content-[':'] after:w-3 after:inline-block after:text-center">Maria
                                        DB</label>
                                    <span>10.5.28-MariaDB-ubu2004 - <b>Container</b></span>
                                </li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">
                                    <label
                                        className="font-bold md:after:content-[':'] after:w-3 after:inline-block after:text-center">Redis
                                        DB</label>
                                    <span>Redis server v=7.4.2 - <b>Container</b></span>
                                </li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">
                                    <label
                                        className="font-bold md:after:content-[':'] after:w-3 after:inline-block after:text-center">WebServer</label>
                                    <span>NGINX version: nginx/1.27.4 - <b>Container</b></span>
                                </li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">
                                    <label
                                        className="font-bold md:after:content-[':'] after:w-3 after:inline-block after:text-center">Elastic
                                        Search</label>
                                    <span>ElasticSearch:8.13.0 - <b>Container</b></span>
                                </li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">
                                    <label
                                        className="font-bold md:after:content-[':'] after:w-3 after:inline-block after:text-center">LogStash</label>
                                    <span>LogStash:8.13.0 - <b>Container</b></span>
                                </li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">
                                    <label
                                        className="font-bold md:after:content-[':'] after:w-3 after:inline-block after:text-center">Kibana</label>
                                    <span>Kibana:8.13.0 - <b>Container</b></span>
                                </li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">
                                    <label
                                        className="font-bold md:after:content-[':'] after:w-3 after:inline-block after:text-center">CI/CD</label>
                                    <span>GitHubAction</span>
                                </li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">
                                    <span>Staging & Production 분리(WebApp & NodeJS)</span>
                                </li>
                            </ul>

                            {/* 구분선 */}
                            <div className="mt-4 border"></div>
                            {/* 웹 애플리케이션 기술 스택 섹션 */}
                            <h5 className="mt-4 font-bold">@Web Application</h5> {/* 섹션 제목 */}
                            <ul className="mt-4 ps-5 flex flex-col gap-2 md:gap-1"> {/* 순서 없는 목록 */}
                                {/* Laravel 버전을 props에서 받아 동적으로 표시 */}
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">
                                    <label
                                        className="font-bold md:after:content-[':'] after:w-3 after:inline-block after:text-center">Laravel</label>
                                    <span>v{laravelVersion}</span>
                                </li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">Inertia2</li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">Reactjs</li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">TailWind</li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">
                                    <label
                                        className="font-bold md:after:content-[':'] after:w-3 after:inline-block after:text-center">NodeJS</label>
                                    <span>ExpressJS , SocketIO</span>
                                </li>
                            </ul>

                            {/* 구분선 */}
                            <div className="mt-4 border"></div>
                            {/* 사용된 라이브러리 섹션 */}
                            <h5 className="mt-4 font-bold">@Libraries</h5> {/* 섹션 제목 */}
                            <ul className="mt-4 ps-5 flex flex-col gap-2 md:gap-1"> {/* 순서 없는 목록 */}
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">
                                    <label
                                        className="font-bold md:after:content-[':'] after:w-3 after:inline-block after:text-center">Auth</label>
                                    <span>laravel/sanctum ^4.0</span>
                                </li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">
                                    <label
                                        className="font-bold md:after:content-[':'] after:w-3 after:inline-block after:text-center">Build
                                        Tool</label>
                                    <span>laravel-vite-plugin ^1.2.0</span>
                                </li>
                            </ul>

                            {/* 구분선 */}
                            <div className="mt-4 border"></div>
                            {/* 주요 기능 섹션 */}
                            <h5 className="mt-4 font-bold">@Features</h5> {/* 섹션 제목 */}
                            <ul className="mt-4 ps-5"> {/* 순서 없는 목록 */}
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">Real
                                    Time System Using NodeJS SocketIO
                                </li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">EL
                                    & Kibana Page(using Proxy)
                                </li>
                                {/* Chatting 항목 - 아코디언 적용 */}
                                {/* Chatting 항목 - 아코디언 적용 */}
                                <li className="flex flex-col before:content-['○'] before:absolute before:-left-5 relative">
                                    {/* 제목과 버튼 영역 */}
                                    <div className="flex flex-row items-center cursor-pointer"
                                         onClick={toggleChatAccordion}>
                                        <span>Chatting</span>
                                        <button
                                            className="ml-3 px-2.5 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 transition duration-150 ease-in-out"
                                            aria-expanded={isChatAccordionOpen}
                                            aria-controls="chat-details-content"
                                        >
                                            {isChatAccordionOpen ? '닫기' : '상세보기'}
                                        </button>
                                    </div>

                                    {/* 아코디언 내용 영역 - 상태에 따라 높이 조절 */}
                                    <div
                                        id="chat-details-content"
                                        className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                            // 내용 추가로 최대 높이 늘림 (Tailwind JIT 모드 필요시 사용 or 더 큰 값 사용: max-h-[500px] 등)
                                            isChatAccordionOpen ? 'max-h-[400px] mt-2 opacity-100' : 'max-h-0 mt-0 opacity-0'
                                        }`}
                                    >
                                        {/* 실제 내용 컨테이너 (섹션간 간격 추가) */}
                                        <div
                                            className="p-3 mt-1 bg-slate-50 rounded border border-slate-200 text-sm text-gray-700 space-y-3">

                                            {/* 기술 스택 섹션 */}
                                            <div>
                                                <p className="font-semibold mb-1 text-gray-800">주요 기술 스택:</p>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    {chatTechStack.map((item) => (
                                                        <li key={item.category}>
                                                            <span
                                                                className="font-medium text-gray-900">{item.category}:</span> {item.techs}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* --- 프로세스 섹션 추가 --- */}
                                            <div>
                                                <p className="font-semibold mb-1 text-gray-800">간략 프로세스:</p>
                                                {/* 순서 있는 목록(ol) 사용 */}
                                                <ol className="list-decimal pl-5 space-y-1">
                                                    {chatProcess.map((step, index) => (
                                                        <li key={index}>{step}</li>
                                                    ))}
                                                </ol>
                                            </div>
                                            {/* --- 프로세스 섹션 끝 --- */}

                                        </div>
                                    </div>
                                </li>
                            </ul>

                            {/* 구분선 */}
                            <div className="mt-4 border"></div>
                            {/* TODO (향후 계획) 섹션 */}
                            <h5 className="mt-4 font-bold">@TODO</h5> {/* 섹션 제목 */}
                            <ul className="mt-4 list-disc ps-5"> {/* 순서 없는 목록 */}
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">Python
                                    & AI 기반 간단 추천 기능
                                </li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">Docker
                                    Scaling
                                </li>
                                <li className="flex md:flex-row flex-col before:content-['○'] before:absolute before:top-0 before:-left-5 relative">Docker
                                    Swarm | Kubernetes
                                </li>
                            </ul>

                        </div>
                        {/* 카드 내부 컨텐츠 끝 */}
                    </div>
                    {/* 첫 번째 정보 카드 끝 */}

                    {/* 배포 시간 정보 카드 */}
                    <div
                        className="mt-4 overflow-hidden bg-white shadow-sm sm:rounded-lg"> {/* 위쪽 마진, 흰색 배경, 그림자, 둥근 모서리 */}
                        <div className="p-6 text-gray-900"> {/* 카드 내부 패딩 및 텍스트 색상 */}
                            {/* deploymentTime prop을 사용하여 마지막 배포(수정) 시간을 표시 */}
                            <span>GIT - Last Modified {deploymentTime}</span>
                        </div>
                    </div>
                    {/* 배포 시간 정보 카드 끝 */}

                </div>
                {/* 최대 너비 컨테이너 끝 */}
            </div> {/* 페이지 메인 컨텐츠 영역 끝 */}
        </AuthenticatedLayout> // AuthenticatedLayout 컴포넌트 끝
    );
}
