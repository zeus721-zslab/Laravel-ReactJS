import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // 기본 인증 레이아웃 컴포넌트를 가져옵니다. (로그인 상태 등 처리)
import { Head } from '@inertiajs/react'; // Inertia.js의 Head 컴포넌트를 가져옵니다. 페이지 <head> 태그 관리에 사용됩니다.

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
    const RepositoryUrl = 'https://github.com/zeus721-zslab/Laravel-ReactJS';

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
                                href={RepositoryUrl} // 링크 URL
                                target="_blank" // 새 탭에서 열기
                                rel="noopener noreferrer" // 보안 및 성능 향상을 위한 속성
                                // Tailwind CSS 클래스를 이용한 스타일링 (둥근 모서리, 패딩, 텍스트 색상, 포커스 효과, 다크모드 등)
                                className="rounded-md py-3 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                            >
                                Public Repository&nbsp;{svgIcon} {/* 링크 텍스트와 SVG 아이콘 표시 */}
                            </a>

                            {/* 시스템 구성 정보 섹션 */}
                            <h5 className="mt-4 font-bold">@System Configure</h5> {/* 섹션 제목 */}
                            <ul className="mt-4 list-disc ps-5"> {/* 위쪽 마진, 디스크 불릿, 왼쪽 패딩을 가진 순서 없는 목록 */}
                                <li>Docker : Docker version 28.0.1</li>
                                <li>Docker-compose : docker-compose version 1.29.2</li>
                                {/* PHP 버전을 props에서 받아 동적으로 표시 */}
                                <li>Web Application : PHP {phpVersion} - <b>Container</b></li>
                                <li>Socket Application : NodeJS Express - <b>Container</b></li>
                                <li>Maria DB : 10.5.28-MariaDB-ubu2004 - <b>Container</b></li>
                                <li>Redis DB : Redis server v=7.4.2 - <b>Container</b></li>
                                <li>WebServer : NGINX version: nginx/1.27.4 - <b>Container</b></li>
                                <li>CI/CD : GitAction</li>
                                <li>Staging & Production 분리(WebApp & NodeJS) </li>
                            </ul>

                            {/* 구분선 */}
                            <div className="mt-4 border"></div>
                            {/* 웹 애플리케이션 기술 스택 섹션 */}
                            <h5 className="mt-4 font-bold">@Web Application</h5> {/* 섹션 제목 */}
                            <ul className="mt-4 list-disc ps-5"> {/* 순서 없는 목록 */}
                                {/* Laravel 버전을 props에서 받아 동적으로 표시 */}
                                <li>Laravel : v{laravelVersion}</li>
                                <li>Inertia2</li>
                                <li>Reactjs</li>
                                <li>TailWind</li>
                                <li>NodeJS : ExpressJS , SocketIO</li>
                            </ul>

                            {/* 구분선 */}
                            <div className="mt-4 border"></div>
                            {/* 사용된 라이브러리 섹션 */}
                            <h5 className="mt-4 font-bold">@Libraries</h5> {/* 섹션 제목 */}
                            <ul className="mt-4 list-disc ps-5"> {/* 순서 없는 목록 */}
                                <li>Auth : laravel/sanctum ^4.0</li>
                                <li>Build Tool : laravel-vite-plugin ^1.2.0</li>
                            </ul>

                            {/* 구분선 */}
                            <div className="mt-4 border"></div>
                            {/* 주요 기능 섹션 */}
                            <h5 className="mt-4 font-bold">@Features</h5> {/* 섹션 제목 */}
                            <ul className="mt-4 list-disc ps-5"> {/* 순서 없는 목록 */}
                                <li>Real Time System Using NodeJS SocketIO</li>
                                <li>EL & Kibana Page(using Proxy)</li>
                                <li><b className="text-green-700">[ING]</b>&nbsp;Chatting</li>
                            </ul>

                            {/* 구분선 */}
                            <div className="mt-4 border"></div>
                            {/* TODO (향후 계획) 섹션 */}
                            <h5 className="mt-4 font-bold">@TODO</h5> {/* 섹션 제목 */}
                            <ul className="mt-4 list-disc ps-5"> {/* 순서 없는 목록 */}
                                <li>Python & AI 기반 간단 추천 기능</li>
                                <li>Docker Scaling</li>
                                <li>Docker Swarm | Kubernetes</li>
                            </ul>

                        </div> {/* 카드 내부 컨텐츠 끝 */}
                    </div> {/* 첫 번째 정보 카드 끝 */}

                    {/* 배포 시간 정보 카드 */}
                    <div className="mt-4 overflow-hidden bg-white shadow-sm sm:rounded-lg"> {/* 위쪽 마진, 흰색 배경, 그림자, 둥근 모서리 */}
                        <div className="p-6 text-gray-900"> {/* 카드 내부 패딩 및 텍스트 색상 */}
                            {/* deploymentTime prop을 사용하여 마지막 배포(수정) 시간을 표시 */}
                            <span>GIT - Last Modified {deploymentTime}</span>
                        </div>
                    </div> {/* 배포 시간 정보 카드 끝 */}

                </div> {/* 최대 너비 컨테이너 끝 */}
            </div> {/* 페이지 메인 컨텐츠 영역 끝 */}
        </AuthenticatedLayout> // AuthenticatedLayout 컴포넌트 끝
    );
}
