import { usePage } from "@inertiajs/react";

export default function NavBar() {
    const auth = usePage().props.auth;
    return (
        <nav className="bg-black text-white p-4 shadow-md w-full top-0 flex justify-between items-center">
            <div className="container mx-auto text-lg font-semibold flex align-center">
                <a href="/" >
                    <div className="flex items-center space-x-2">
                        <img src="/logo.png" alt="" style={{ width: '5vh' }} />
                        <span>MyFilmes Server</span>
                    </div>
                </a>
            </div>
            {auth.user ? (
                <div className="flex space-x-4">
                    <a href="/dashboard" className="hover:text-blue-300 whitespace-nowrap">Dashboard</a>
                </div>
            ) : (
                <div className="flex space-x-4">
                    <a href="/register" className="hover:text-blue-300 whitespace-nowrap">Registre-se</a>
                    <a href="/login" className="hover:text-blue-300 whitespace-nowrap">Login</a>
                </div>
            )}
        </nav>
    )
}