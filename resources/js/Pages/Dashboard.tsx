import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Filme } from '@/types/Types';
import { Head, usePage } from '@inertiajs/react';
import axios, { AxiosProgressEvent } from 'axios';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const page = usePage();
    const [filmes, setFilmes] = useState<Filme[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    // todo: adicionar opção de tamanho de página
    const [size, setSize] = useState<number>(20);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [capaFile, setCapaFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [filme, setFilme] = useState<Filme>({
        id: 0,
        titulo: '',
        sinopse: '',
        url_capa: '',
        url_filme: '',
    });


    const getFilmes = async (page: number) => {
        axios.get(`/api/filmes/all/${page}/${size}`).then((response) => {
            setFilmes(response.data.filmes.data);
            setTotalPages(response.data.filmes.last_page);
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getFilmes(currentPage);
    }, [currentPage]);

    useEffect(() => {
        
        //@ts-ignore
        setFilmes(page.props.filmes.data);
        //@ts-ignore
        setCurrentPage(page.props.filmes.current_page);
        //@ts-ignore
        setTotalPages(page.props.filmes.last_page);
        //@ts-ignore
        setIsAdmin(page.props.isAdmin);
    }, []);

    const deleteFilme = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir este filme?')) {
            try {
                await axios.delete(`/api/filmes/${id}`);
                setFilmes(filmes.filter((filme: Filme) => filme.id !== id));
                alert('Filme excluído com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir o filme:', error);
                alert('Erro ao excluir o filme. Tente novamente.');
            }
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setFile(file);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!filme.titulo) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        if (!filme.id) {
            if (!videoFile ) {
                alert("Por favor, selecione um arquivo de vídeo e uma capa.");
                return;
            }
        }

        const formData = new FormData();
        formData.append("titulo", filme.titulo);
        formData.append("sinopse", filme.sinopse);

        if (capaFile instanceof File) {
            formData.append("capa", capaFile);
        }

        if (videoFile instanceof File) {
            formData.append("video", videoFile);
        }

        setLoading(true);

        try {
            const url = filme.id ? `/api/filmes/update/${filme.id}` : "/api/filmes/store";

            await axios({
                method: "post", 
                url: url,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                },
            });

            setLoading(false);
            alert(filme.id ? "Filme atualizado com sucesso!" : "Filme cadastrado com sucesso!");
            getFilmes(1);
            setIsOpen(false);

        } catch (error: any) {
            setLoading(false);
            alert(`Erro ao processar o filme: ${error.response?.data?.message || "Tente novamente."}`);
        }
    };

    const editarFilme = async (filme: Filme) => {
        console.log('filme asdsa', filme)
        setFilme(filme);
        setIsOpen(true);
        setVideoFile(null);
        setCapaFile(null);
        setUploadProgress(0);
        setLoading(false);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* <a href="/filmes/create" className='dark:text-gray-100 cursor-pointer p-3'>Novo Filme</a> */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="px-4 py-2 dark:text-white rounded-md hover:bg-blue-500"
                    >
                        Novo Filme
                    </button>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-semibold">Filmes Cadastrados</h3>
                            <table className="min-w-full mt-4 table-auto border-collapse dark:text-gray-100">
                                <thead>
                                    <tr className="dark:text-gray-100">
                                        <th className="px-4 py-2 text-left w-1/12">ID</th>
                                        <th className="px-4 py-2 text-left w-5/12">Titulo</th>
                                        <th className="px-4 py-2 text-left w-4/12">URL</th>
                                        {isAdmin &&(
                                            <th className="px-4 py-2 text-left w-3/12">Ações</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filmes.length > 0 ? (
                                        filmes.map((filme: Filme) => (
                                            <tr key={filme.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="px-4 py-2">{filme.id}</td>
                                                <td className="px-4 py-2">{filme.titulo}</td>
                                                <td className="px-4 py-2">{filme.url_filme}</td>
                                                {isAdmin &&(
                                                    <td className="px-4 py-2">
                                                    <span className='cursor-pointer p-2 hover:underline' onClick={(e) => editarFilme(filme)}>editar</span>
                                                    |
                                                    <span className='cursor-pointer p-2 hover:underline' onClick={(e) => deleteFilme(filme.id)}>deletar</span>
                                                </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-2 text-center">Nenhum filme encontrado</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {/* Paginação */}
                            {totalPages > 0 && (
                                <div className="flex justify-center mt-8 col-span-5">
                                    <nav className="inline-flex space-x-2">
                                        {/* Botão de Página Anterior */}
                                        <button
                                            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Anterior
                                        </button>

                                        {/* Páginas visíveis */}
                                        <button
                                            className={`px-4 py-2 rounded-md ${currentPage === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-100'}`}
                                            onClick={() => setCurrentPage(currentPage)}
                                        >
                                            {currentPage}
                                        </button>

                                        {currentPage + 1 <= totalPages && (
                                            <button
                                                className={`px-4 py-2 rounded-md ${currentPage === currentPage + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-100'}`}
                                                onClick={() => setCurrentPage(currentPage + 1)}
                                            >
                                                {currentPage + 1}
                                            </button>

                                        )}
                                        {/* Botão de Próxima Página */}
                                        <button
                                            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Próxima
                                        </button>
                                    </nav>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto" >
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className='flex justify-between '>
                                        <h2 className="text-2xl font-semibold text-center mb-4">Cadastrar Novo Filme</h2>
                                        <span className="cursor-pointer" onClick={(e) => setIsOpen(false)}>x</span>
                                    </div>
                                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                                        <div className="mb-4">
                                            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
                                            <input
                                                type="text"
                                                id="titulo"
                                                value={filme.titulo}
                                                onChange={(e) => setFilme({ ...filme, titulo: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="sinopse" className="block text-sm font-medium text-gray-700">Sinopse</label>
                                            <textarea
                                                id="sinopse"
                                                value={filme.sinopse}
                                                onChange={(e) => setFilme({ ...filme, sinopse: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                rows={4}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="capa" className="block text-sm font-medium text-gray-700">Carregar Capa</label>
                                            <input
                                                type="file"
                                                id="capa"
                                                onChange={(e) => handleFileChange(e, setCapaFile)}
                                                accept="image/*"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="video" className="block text-sm font-medium text-gray-700">Carregar Vídeo</label>
                                            <input
                                                type="file"
                                                id="video"
                                                onChange={(e) => handleFileChange(e, setVideoFile)}
                                                accept="video/*"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required={filme.id > 0 ? false : true}
                                            />
                                        </div>

                                        {videoFile && <p className="text-sm text-gray-600">Vídeo: {videoFile.name}</p>}
                                        {capaFile && <p className="text-sm text-gray-600">Capa: {capaFile.name}</p>}

                                        {loading && (
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600">Carregando... {uploadProgress}%</p>
                                                <div className="w-full bg-gray-200 rounded-md h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-md"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                                            disabled={loading}
                                        >
                                            {loading ? 'Cadastrando...' : 'Cadastrar Filme'}
                                        </button>
                                    </form>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
