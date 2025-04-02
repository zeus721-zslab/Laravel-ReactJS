import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';

export default function Dashboard({laravelVersion, phpVersion , deploymentTime}) {

    const svgIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="15" // 원하는 가로 크기
            height="15" // 원하는 세로 크기
            style={{ display: 'inline-block' }}

        >
            <path d="M15 10v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"></path>
            <polyline points="12 3 18 3 18 9"></polyline>
            <line x1="8" y1="11" x2="18" y2="3"></line>
        </svg>
    );

    const RepositoryUrl = 'https://github.com/zeus721-zslab/Laravel-ReactJS';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            {/**/}
                            <a href={RepositoryUrl} target="_blank" rel="noopener noreferrer" // 보안 및 성능 향상
                               className="rounded-md py-3 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white">
                                Public Repository&nbsp;{svgIcon}
                            </a>

                            {/**/}
                            <h5 className="font-bold mt-4">@System Configure</h5>
                            <ul className="list-disc ps-5 mt-4">
                                <li>Docker : Docker version 28.0.1</li>
                                <li>Docker-compose : docker-compose version 1.29.2</li>
                                <li>PHP : {phpVersion} - <b>Container</b></li>
                                <li>Maria DB : 10.5.28-MariaDB-ubu2004 - <b>Container</b></li>
                                <li>Redis DB : Redis server v=7.4.2 - <b>Container</b></li>
                                <li>WebServer : nginx version: nginx/1.27.4 - <b>Container</b></li>
                                <li>CI/CD : GitAction</li>
                            </ul>

                            {/**/}
                            <div className="border mt-4"></div>
                            <h5 className="font-bold mt-4">@Application</h5>
                            <ul className="list-disc ps-5 mt-4">
                                <li>Laravel : v{laravelVersion}</li>
                                <li>Inertia2</li>
                                <li>Reactjs</li>
                                <li>TailWind</li>
                            </ul>

                            {/**/}
                            <div className="border mt-4"></div>
                            <h5 className="font-bold mt-4">@Library</h5>
                            <ul className="list-disc ps-5 mt-4">
                                <li>Auth : laravel/sanctum ^4.0</li>
                                <li>Build Tool : laravel-vite-plugin ^1.2.0</li>
                            </ul>

                            {/**/}
                            <div className="border mt-4"></div>
                            <h5 className="font-bold mt-4">@TODO</h5>
                            <ul className="list-disc ps-5 mt-4">
                                <li>Real Time System using Laravel Queue & NodeJS & Socket.io - <b>Container</b></li>
                                <li>Docker scale</li>
                                <li>Docker Swarm | Kubernetes</li>
                            </ul>

                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mt-4">
                        <div className="p-6 text-gray-900">
                            <span>GIT - Last Modified {deploymentTime}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
