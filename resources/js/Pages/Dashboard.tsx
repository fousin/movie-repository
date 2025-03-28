import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Filme } from '@/types/Types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [files, setFilmes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [size, setSize] = useState(10); // Ajustei para 10 por página

    const getFilmes = async (page: number) => {
        axios.get(`/api/filmes/all/${page}/${size}`).then((response) => {
            setFilmes(response.data.files.data);
            setTotalPages(response.data.last_page);
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getFilmes(currentPage);
    }, [currentPage]);

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
                    <a href="/filmes/create" className='dark:text-gray-100 cursor-pointer p-3'>Novo Filme</a>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-semibold">Filmes Cadastrados</h3>
                            <table className="min-w-full mt-4 table-auto border-collapse dark:text-gray-100">
                                <thead>
                                    <tr className="dark:text-gray-100">
                                        <th className="px-4 py-2 text-left w-1/12">ID</th>
                                        <th className="px-4 py-2 text-left w-6/12">Titulo</th>
                                        <th className="px-4 py-2 text-left w-5/12">URL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.length > 0 ? (
                                        files.map((filme: Filme) => (
                                            <tr key={filme.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-2">{filme.id}</td>
                                                <td className="px-4 py-2">{filme.titulo}</td>
                                                <td className="px-4 py-2">{filme.url_filme}</td>
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
                            <div className="flex justify-center mt-4">
                                <nav className="inline-flex space-x-2">
                                    {currentPage > 1 && (
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                        >
                                            Anterior
                                        </button>
                                    )}

                                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            className={`px-4 py-2 rounded-md ${currentPage === pageNumber ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
                                            onClick={() => setCurrentPage(pageNumber)}
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}

                                    {currentPage < totalPages && (
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                        >
                                            Próxima
                                        </button>
                                    )}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
