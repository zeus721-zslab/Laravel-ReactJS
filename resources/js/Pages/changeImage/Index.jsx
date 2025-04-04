import {Head, usePage} from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import axios from 'axios'; // axios import 추가

const Index = ( ) => {

        const auth_user = usePage().props.auth.user;
        const [selectedImage, setSelectedImage] = useState(null);
        const [uploadMessage, setUploadMessage] = useState('');

        const handleImageChange = (event) => {
            if (event.target.files && event.target.files[0]) {
                setSelectedImage(event.target.files[0]);
            }
        };

        const handleUpload = async () => {
            if (selectedImage) {
                const formData = new FormData();
                formData.append('image', selectedImage); // Laravel 백엔드에서 'image'라는 이름으로 받도록 설정

                const uploadUrl = '/changeImg/upload'; // 실제 Laravel 업로드 API 엔드포인트로 변경해야 합니다.
                await axios.post(uploadUrl, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }).then(response => {
                    console.log('업로드 성공:', response.data);
                    setUploadMessage('이미지 업로드 및 처리 요청 완료!'); // 성공 메시지
                }).catch(error => {
                    console.error('업로드 실패:', error);
                    setUploadMessage('이미지 업로드 실패: ' + (error.response?.data?.message || error.message)); // 실패 메시지
                });

            } else {
                setUploadMessage('업로드할 이미지를 선택해주세요.');
            }
        };

    // 삭제 함수

    return (

        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800"> Change Image </h2>
            }
        >
            <Head title="Change Image"/>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <h5 className={`font-bold`}>진행 프로세스</h5>
                        <ul className={`list-decimal ps-4 text-sm mt-3 flex flex-col gap-1`}>
                            <li>파일 업로드</li>
                            <li>라라벨 컨트롤러에서 파일 Upload 및 REDIS를 통한 Queue생성</li>
                            <li>NodeJS 서버에서 Queue 캐치</li>
                            <li>간단한 이미지 변환</li>
                            <li>이미지 변환 후 변환된 파일경로를 2초 뒤 알림처리</li>
                        </ul>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6 mt-4">
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                이미지 선택
                            </label>
                            <input
                                type="file"
                                id="image"
                                className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={handleImageChange}
                            />
                        </div>

                        {selectedImage && (
                            <div className="mt-4">
                                <img src={URL.createObjectURL(selectedImage)} alt="선택된 이미지"
                                     className="max-h-40 rounded-md"/>
                            </div>
                        )}

                        {auth_user ? (
                            <>
                            <div className="mt-6">
                                <button
                                    onClick={handleUpload}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    이미지 업로드 및 처리 시작
                                </button>
                            </div>
                            {uploadMessage && (
                                <p className="mt-4 text-sm text-gray-600">{uploadMessage}</p>
                            )}
                            </>
                        ) : null }

                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
};

export default Index;
