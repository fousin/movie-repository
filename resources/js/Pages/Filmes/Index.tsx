import { Filme } from "@/types/Types";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import NavBar from "@/Components/NavBar";

export default function Index() {
    const page = usePage();
    const [filmes, setFilmes] = useState<Filme[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [size, setSize] = useState(50);


    useEffect(() => {
        // console.log('page.filmes', page.props.filmes);
        //@ts-ignore
        setFilmes(page.props.filmes.data);
        //@ts-ignore
        setCurrentPage(page.props.filmes.current_page);
        //@ts-ignore
        setTotalPages(page.props.filmes.last_page);
    }, []);

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

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Head title="Index" />

            {/* Navbar */}
            <NavBar />

            <div className="container mx-auto mt-20 p-4 ">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-4">

                    {filmes.length > 0 ? (
                        filmes.map((filme: Filme) => (
                            <Link href={`/filmes/show/${filme.id}`} key={filme.id} className="block">
                                <div className="container mx-auto mt-10 p-4 flex flex-col items-center">
                                    <div className="relative w-64 h-96 group">
                                        {/* Imagem da capa */}
                                        <img
                                            src={filme.url_capa}
                                            alt={`Capa de ${filme.titulo}`}
                                            className="w-full h-full object-cover rounded-lg shadow-lg"
                                        />
                                        {/* Sobreposição com sinopse ao passar o mouse */}
                                        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg p-4">
                                            <span className="text-white text-sm">{filme.sinopse}</span>
                                        </div>
                                    </div>
                                    {/* Título do filme */}
                                    <h3 className="mt-2 text-lg font-semibold text-center">{filme.titulo}</h3>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-5 flex justify-center items-center h-64">
                            <p className="text-gray-500 text-lg">Nenhum filme encontrado.</p>
                        </div>
                    )}

                </div>
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
    );
}
