import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';

export default function Dashboard({laravelVersion, phpVersion , deploymentTime}) {
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

                            <Link href="https://github.com/zeus721-zslab/Laravel-ReactJS" className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white">
                                Public Repository
                            </Link>

                            <h5 className="font-bold">System Configure</h5>
                            <ul className="list-disc ps-5 mt-4">
                                <li>Docker : Docker version 28.0.1</li>
                                <li>Docker-compose : docker-compose version 1.29.2</li>
                                <li>PHP : {phpVersion} - <b>Container</b></li>
                                <li>Marid DB : 10.5.28-MariaDB-ubu2004 - <b>Container</b></li>
                                <li>Redis DB : Redis server v=7.4.2 - <b>Container</b></li>
                                <li>WebServer : nginx version: nginx/1.27.4 - <b>Container</b></li>
                                <li>CI/CD : GitAction </li>
                            </ul>


                            <div className="border mt-4"></div>

                            <h5 className="font-bold mt-4">Application</h5>

                            <ul className="list-disc ps-5 mt-4">
                                <li>Laravel : v{laravelVersion}</li>
                                <li>Inertia2</li>
                                <li>Reactjs</li>
                                <li>TailWind</li>
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
