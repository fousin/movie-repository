import { Arquivo } from "@/types/Types";
import { Head, usePage } from "@inertiajs/react";
import axios, { AxiosProgressEvent } from "axios";
import { useEffect, useState } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Arquivos() {
    const page = usePage();
    const [arquivos, setArquivos] = useState<Arquivo[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [size, setSize] = useState(30);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [arquivo, setArquivo] = useState<Arquivo>({});
    const [newFile, setNewFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    // const [videoFile, setVideoFile] = useState<File | null>(null);
    // const [capaFile, setCapaFile] = useState<File | null>(null);

    useEffect(() => {
        console.log('page.arquivos', page.props.arquivos);
        //@ts-ignore
        setArquivos(page.props.arquivos.data);
        //@ts-ignore
        setCurrentPage(page.props.arquivos.current_page);
        //@ts-ignore
        setTotalPages(page.props.arquivos.last_page);
    }, []);

    useEffect(() => {
        getFiles(currentPage);
    }, [currentPage]);

    const getFiles = async (page: number) => {
        axios.get(`/api/arquivos/all/${page}/${size}`).then((response) => {
            setArquivos(response.data.arquivos.data);
            setTotalPages(response.data.arquivos.last_page);
        }).catch((error) => {
            console.log(error);
        });
    }

    const deleteArquivo = async (id: number) => {
        if (id === 0) {
            alert("ID inválido.");
            return;
        }

        axios.delete(`/api/arquivos/${id}`).then((response) => {
            console.log(response.data);
            setArquivos(arquivos.filter((arquivo) => arquivo.id !== id));
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!arquivo.type || !newFile) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const formData = new FormData();
        // Adicionando o campo de 'type' ao FormData
        formData.append("type", arquivo.type);

        if (newFile instanceof File) {
            formData.append("file", newFile);
        }

        setLoading(true);

        try {
            await axios({
                method: "post",
                url: route('arquivos.store'),
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
            alert(arquivo.id ? "Arquivo atualizado com sucesso!" : "Arquivo cadastrado com sucesso!");
            getFiles(1); 
            setIsOpen(false);
            setArquivo({});

        } catch (error: any) {
            setLoading(false);
            alert(`Erro ao processar o arquivo: ${error.response?.data?.message || "Tente novamente."}`);
        }
    };


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Arquivos
                </h2>
            }
        >
            <Head title="Index" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="px-4 py-2 dark:text-white rounded-md hover:bg-blue-500"
                    >
                        Novo Arquivo
                    </button>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-semibold">Arquivos Cadastrados</h3>
                            <table className="min-w-full mt-4 table-auto border-collapse dark:text-gray-100">
                                <thead>
                                    <tr className="dark:text-gray-100">
                                        <th className="px-4 py-2 text-left w-1/12">ID</th>
                                        <th className="px-4 py-2 text-left w-5/12">Nome</th>
                                        <th className="px-4 py-2 text-left w-4/12">Tipo</th>
                                        <th className="px-4 py-2 text-left w-4/12">URL</th>
                                        <th className="px-4 py-2 text-left w-3/12">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {arquivos.length > 0 ? (
                                        arquivos.map((arquivo: Arquivo) => (
                                            <tr key={arquivo.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="px-4 py-2">{arquivo.id}</td>
                                                <td className="px-4 py-2">{arquivo.name}</td>
                                                <td className="px-4 py-2">{arquivo.type}</td>
                                                <td className="px-4 py-2">{arquivo.url}</td>
                                                <td className="px-4 py-2">
                                                    <span className="cursor-pointer p-2 hover:underline" onClick={() => deleteArquivo(arquivo?.id || 0)}>deletar</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-2 text-center">Nenhum arquivo encontrado</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Paginação */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <nav className="inline-flex space-x-2">
                                        <button
                                            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Anterior
                                        </button>

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

            {/* Modal de Cadastro de Arquivo */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-md p-6 max-w-lg w-full">
                        <h3 className="text-xl font-semibold mb-4">{arquivo.id ? 'Editar Arquivo' : 'Cadastrar Novo Arquivo'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">tipo</label>
                                <select name="type" id="type"
                                    value={arquivo.type}
                                    onChange={(e) => setArquivo({ ...arquivo, type: e.target.value })}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                >
                                    <option value="capas">Capa</option>
                                    <option value="videos">Video</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Vídeo</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, setNewFile)}
                                    className="mt-1 block w-full text-sm text-gray-700"
                                    accept="video/*"
                                />
                            </div>
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
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 bg-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="ml-3 px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-300"
                                >
                                    {loading ? 'Enviando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
