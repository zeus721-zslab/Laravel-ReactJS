// resources/js/Pages/Posts/Index.jsx

import React, { useState } from 'react';
import axios from 'axios';
import {Head, router} from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import DangerButton from "@/Components/DangerButton.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";

import '../../bootstrap.js';

const Index = ( lists ) => {

    const auth_user = window.AuthUser();
    const [posts, setPosts] = useState(lists.lists);

    // 삭제 함수
    const deletePost = (id) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            axios.delete(`/posts/${id}`)
                .then(() => {
                    setPosts(posts.filter(post => post.id !== id));
                })
                .catch(error => {
                    console.error('삭제 실패:', error);
                });
        }
    };

    return (

        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800"> Posts List </h2>
            }
        >
            <Head title="Posts" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 lg:w-1/2">
                            {auth_user ?
                                (
                                <PrimaryButton onClick={() => router.visit(route('posts.create'))} className="mb-4">
                                    게시글 작성
                                </PrimaryButton>
                                ) : null
                            }

                            <ul className="grid grid-cols-1 gap-3 w-full">
                                {posts.map(post => (
                                    <li key={post.id} className="p-2 shadow-lg border rounded">
                                        <h2 className="border-b-2 p-2 rounded">{post.title}</h2>
                                        <p className="p-2 whitespace-pre-wrap">{post.body}</p>
                                        { auth_user && auth_user.id === post.user_id ?
                                            (
                                                <div className="flex gap-2 justify-end p-2">
                                                    <SecondaryButton disabled={false} className="py-1 px-2"
                                                                     onClick={() => router.visit(`/posts/${post.id}/edit`)}>
                                                        편집
                                                    </SecondaryButton>
                                                    <DangerButton disabled={false} className="py-1 px-2"
                                                                  onClick={() => deletePost(post.id)}>
                                                        삭제
                                                    </DangerButton>
                                                </div>
                                            ) : null

                                        }
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
