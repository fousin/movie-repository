import { Filme } from "@/types/Types";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Index() {
    const page = usePage();
    const [filmes, setFilmes] = useState<Filme[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [size, setSize] = useState(50);

    useEffect(() => {
        console.log(page.props.filmes);
        //@ts-ignore
        setFilmes(page.props.filmes.data);
        //@ts-ignore
        setTotalPages(page.props.filmes.last_page);
    }, []);

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
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white p-4 shadow-md fixed w-full top-0 flex justify-between items-center">
                <div className="container mx-auto text-lg font-semibold">MyFilmes Server</div>
                <div className="flex space-x-4">
                    <a href="/register" className="hover:text-blue-300 whitespace-nowrap">Registre-se</a>
                    <a href="/login" className="hover:text-blue-300 whitespace-nowrap">Login</a>
                </div>
            </nav>

            <div className="container mx-auto mt-20 p-4">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {filmes.map((filme: Filme) => (
                        <div key={filme.id} className="container mx-auto mt-10 p-4 flex justify-center">
                            <div className="relative w-64 h-64 group">
                                <img
                                    src={filme.url_capa}
                                    alt={'capa ' + filme.titulo}
                                    className="w-full h-full object-cover rounded-lg shadow-lg"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                    <span className="text-white text-lg font-semibold">{filme.sinopse}</span>
                                </div>
                            </div>
                            <div className="ml-4 text-center">
                                <h3 className="text-lg font-semibold">{filme.titulo}</h3>
                                <p>{filme.sinopse}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {filmes.length > 0 && (
                    <div className="flex justify-center mt-8">
                        <nav className="inline-flex space-x-2">
                            {/* Botão de Página Anterior */}
                            {currentPage > 1 && (
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    Anterior
                                </button>
                            )}

                            {/* Botões de Páginas */}
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    className={`px-4 py-2 rounded-md ${currentPage === pageNumber ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
                                    onClick={() => setCurrentPage(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            ))}

                            {/* Botão de Próxima Página */}
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
                )}
            </div>
        </div>
    );
}
