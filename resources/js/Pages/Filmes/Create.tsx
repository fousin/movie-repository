import { Filme } from "@/types/Types";
import { useState } from "react";
import axios from "axios";

export default function Create() {
    const [filme, setFilme] = useState<Filme>({
        id: 0,
        titulo: '',
        sinopse: '',
        url_capa: '',
        url_filme: '',
    });
    const [loading, setLoading] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [capaFile, setCapaFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setFile(file);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!videoFile || !capaFile) {
            alert("Por favor, selecione um arquivo de vídeo e uma capa.");
            return;
        }

        const formData = new FormData();
        formData.append('titulo', filme.titulo);
        formData.append('sinopse', filme.sinopse);
        formData.append('capa', capaFile);
        formData.append('video', videoFile);

        setLoading(true);

        try {
            await axios.post('/api/filmes/store', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent: ProgressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                },
            });
            setLoading(false);
            alert('Filme cadastrado com sucesso!');
        } catch (error) {
            setLoading(false);
            alert('Erro ao cadastrar o filme. Tente novamente.');
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-8">
            <h2 className="text-2xl font-semibold text-center mb-4">Cadastrar Novo Filme</h2>
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
                        required
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
                        required
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
                        required
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
    );
}
