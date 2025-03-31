import { useEffect, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { Filme } from "@/types/Types";

export default function Show() {
    const page = usePage();
    const [filme, setFilme] = useState<Filme>();

    useEffect(() => {
        //@ts-ignore
        setFilme(page.props.filme);
    }, []);

    return (
        <>
            <Head>
                <title>{filme ? filme.titulo : 'Carregando...'}</title>
            </Head>

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <nav className="bg-black text-white p-4 shadow-md w-full top-0 flex justify-between items-center">
                    <div className="container mx-auto text-lg font-semibold">MyFilmes Server</div>
                    <div className="flex space-x-4">
                        <a href="/register" className="hover:text-blue-300 whitespace-nowrap">Registre-se</a>
                        <a href="/login" className="hover:text-blue-300 whitespace-nowrap">Login</a>
                    </div>
                </nav>

                <div className="container mx-auto mt-20 p-4">
                    <a href="/">Voltar</a>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        {filme ? (
                            <>
                                {/* Video Player */}
                                <div className="w-full h-96">
                                    <iframe
                                        src={filme.url_filme}
                                        title={filme.titulo}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                </div>


                                {/* Movie Details */}
                                <div className="p-4 dark:bg-gray-800 dark:text-white">
                                    <h1 className="text-2xl font-semibold mb-2">{filme.titulo}</h1>
                                    <p className="text-gray-700 mb-4">{filme.sinopse}</p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 text-lg font-semibold text-gray-500">Carregando informações do filme...</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
