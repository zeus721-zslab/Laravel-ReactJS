// resources/js/Pages/Posts/Edit.jsx
import {Head, useForm} from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import InputLabel from '@/Components/InputLabel.jsx';
import TextArea from '@/Components/TextArea.jsx';
import TextInput from '@/Components/TextInput.jsx';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import InputError from "@/Components/InputError.jsx";


const Edit = ({ posts }) => {

    const { data, setData, patch, processing, errors } = useForm({
        title: posts.title,
        body: posts.body,
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        patch(`/posts/${posts.id}`,{
            onSuccess : () => {
            }
        });
    };

    const goBack = () => {
        window.history.back(-1);
    };


    return (

        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800"> Edit Post </h2>
            }
        >
            <Head title="Edit Posts" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">


                        <div className="p-6 text-gray-900">
                            <h1>새 게시글 작성</h1>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3 items-start mt-5 lg:w-96">
                                <div className="w-full">
                                    <InputLabel htmlFor="title" value="제목"/>
                                    <TextInput
                                        id="title"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 w-full"
                                        autoComplete="title"
                                        onChange={(e) => setData('title',e.target.value)}
                                        placeholder="제목을 입력해주세요!"
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2"/>
                                </div>
                                <div className="w-full">
                                    <InputLabel htmlFor="title" value="내용"/>
                                    <TextArea
                                        id="body"
                                        name="body"
                                        value={data.body}
                                        className="mt-1 w-full"
                                        autoComplete="body"
                                        onChange={(e) => setData('body', e.target.value)}
                                        placeholder="내용을 입력해주세요!"
                                        rows={6}
                                        required
                                    />
                                    <InputError message={errors.body} className="mt-2"/>
                                </div>
                                <div className="mt-4 w-full flex justify-between">
                                    <PrimaryButton type="submit" disabled={processing}>
                                        저장
                                    </PrimaryButton>
                                    <SecondaryButton type="btn" onClick={goBack}>
                                        뒤로가기
                                    </SecondaryButton>
                                </div>
                            </form>
                        </div>


                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
