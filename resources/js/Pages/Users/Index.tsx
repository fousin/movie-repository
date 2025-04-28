import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Permissao, User } from '@/types/Types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Users() {
    const page = usePage();
    const [users, setUsers] = useState<User[]>([]);
    const [openModal, setOpenModal] = useState(false);
    //todo: adicionar select para alterar size
    const [size, setSize] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [permissoesUser, setPermissoesUser] = useState<Permissao[]>([]);
    const [permissao, setPermissao] = useState<Permissao>({});
    const [roles, setRoles] = useState([]);


    const getDadosUsers = (page: number, size: number) => {
        axios.get(route('user.paginate', { page, size })).then(response => {
            setUsers(response.data.users.data);
            setTotalPages(response.data.users.last_page);
        }).catch(error => {
            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).forEach((errorMessage: any) => {
                    alert(errorMessage)
                });
            } else {
                console.log('erro não catalogado: ', error);
                alert('Erro ao buscar dados dos usuarios!')
            }

        });
    }
    const onPageChange = (page: number) => {
        getDadosUsers(page, size);
        setCurrentPage(page)
    };

    const getPermissoesUser = (id: number | null) => {
        if (!id) {
            alert('Erro ao carregar as permissões do usuário, id inexistente!')
            return;
        }
        axios.get(route('permissao.user', id)).then(response => {
            setPermissoesUser(response.data.permissoes);
        }).catch(error => {
            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).forEach((errorMessage: any) => {
                    alert(errorMessage)
                });
            } else {
                console.log('erro não catalogado: ', error);
                alert('Erro ao buscar permissoes do user!')
            }
        });
    }

    const loadPermissoesUser = (permissoes: Permissao[], id: number | null) => {
        getPermissoesUser(id);
        setPermissao({ user_id: id })
        setOpenModal(true);
    }

    const deletePermissao = (e: any, id: number) => {
        e.preventDefault();
        if (id == 0) {
            alert('Erro ao deletar a permissão, id inexistente!')
        }

        axios.delete(route('permissao.delete', id)).then(response => {
            setPermissoesUser(permissoesUser.filter(permissao => permissao.id !== id));
        }).catch(error => {
            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).forEach((errorMessage: any) => {
                    alert(errorMessage)
                });
            } else {
                console.log('erro não catalogado: ', error);
                alert('Erro ao remover permissao do user!')
            }
        });
    }

    const saveNewPermissaoUser = (e: any) => {
        e.preventDefault();

        axios.post(route('permissao.create'), permissao).then(response => {
            setPermissoesUser([...permissoesUser, response.data.permissao]);
        }).catch(error => {
            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).forEach((errorMessage: any) => {
                    alert(errorMessage)
                });
            } else {
                console.log('erro não catalogado: ', error);
                alert('Erro ao salvar permissao do user!')
            }
        });
    }

    const deleteUser = (id: number | null) => {
        if (!id) {
            alert('Erro ao deletar o usuário, id inexistente!')
            return;
        }

        if (confirm('Deseja realmente apagar o usuário?')) {
            axios.delete(route('users.delete', id)).then(response => {
                setUsers(users.filter(user => user.id !== id));
            }).catch(error => {
                if (error.response?.data?.errors) {
                    Object.values(error.response.data.errors).forEach((errorMessage: any) => {
                        alert(errorMessage)
                    });
                } else {
                    console.log('erro não catalogado: ', error);
                    alert('Erro ao remover usuario!')
                }
            });
        }
    }

    useEffect(() => {
        axios.get(route('role.all')).then(response => {
            setRoles(response.data.roles);
        }).catch(error => {
            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).forEach((errorMessage: any) => {
                    alert(errorMessage)
                });
            } else {
                console.log('erro não catalogado: ', error);
                alert('Erro ao buscar lista de permissoes!')
            }
        });
    }, [])

    useEffect(() => {
        console.log('page?.props?.users.data',page?.props?.users)
        //@ts-ignore
        setUsers(page?.props?.users.data);
        //@ts-ignore
    }, [page?.props?.users]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Usuários
                </h2>
            }
        >
            <Head title="Usuários" />


            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* <a href="/filmes/create" classsName='dark:text-gray-100 cursor-pointer p-3'>Novo Filme</a> */}
                    {/* <button
                        onClick={() => setIsOpen(true)}
                        className="px-4 py-2 dark:text-white rounded-md hover:bg-blue-500"
                    >
                        Novo Usuário
                    </button> */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-semibold">Usuário Cadastrados</h3>
                            <table className="min-w-full mt-4 table-auto border-collapse dark:text-gray-100">
                                <thead>
                                    <tr className="dark:text-gray-100">
                                        <th className="px-4 py-2 text-left w-2/12">ID</th>
                                        <th className="px-4 py-2 text-left w-4/12">Nome</th>
                                        <th className="px-4 py-2 text-left w-4/12">Email</th>
                                        <th className="px-4 py-2 text-left w-3/12">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users?.length > 0 ? users.map((user: User, key: number) => (
                                        <tr key={key} className='border-b hover:bg-gray-50 dark:hover:bg-gray-600'>
                                            <td className='w-2/12 px-4 py-2'>
                                                {user.id}
                                            </td>
                                            <td className='w-4/12 px-4 py-2'>
                                                {user.name}
                                            </td>
                                            <td className='w-4/12 px-4 py-2'>
                                                {user.email}
                                            </td>
                                            <td className='w-2/12 px-4 py-2'>
                                                <div className='flex justify-center'>
                                                    <span onClick={(e) => loadPermissoesUser(user?.permissoes ?? [], user?.id ?? null)} className='cursor-pointer px-2 hover:underline'>
                                                        Permissoes
                                                    </span> |
                                                    <span onClick={(e) => deleteUser(user?.id ?? null)} className='cursor-pointer px-2 hover:underline'>Apagar</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : <tr><td colSpan={7}>Nenhum usuário encontrado</td></tr>}
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


            {openModal && (
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" >
                    <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto" >
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className='flex justify-between '>
                                        <h2 className="text-2xl font-semibold text-center mb-4 dark:text-white">Cadastrar Novo usuário</h2>
                                        <span className="cursor-pointer dark:text-white" onClick={(e) => setOpenModal(false)}>x</span>
                                    </div>
                                    <div className="grid grid-cols-4 mb-2">
                                        <div className='col-span-3 p-1'>
                                            <select id="permissao" className='w-full p-2 rounded-xl' required onChange={e => setPermissao({ ...permissao, role_id: parseInt(e.target.value) })} >
                                                <option value="" className=''>Selecione</option>
                                                {roles.length > 0 && roles.map((role: any, index: number) => (
                                                    <option key={index} value={role.id}>{role.name}</option>
                                                ))}

                                            </select>
                                        </div>
                                        <div className='col-span-1 p-1 '>
                                            <button className='bg-green-600 w-full p-2 rounded-xl ' onClick={(e) => saveNewPermissaoUser(e)}>Salvar</button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1">
                                        {permissoesUser?.length > 0 ? (
                                            permissoesUser.map((permissao: Permissao, key: number) => (
                                                <div key={key} className="border border-gray-300 p-3 m-1 flex justify-between items-center">
                                                    <div className="font-bold dark:text-white">{permissao?.role?.name}</div>
                                                    <button className="bg-red-600 p-3 dark:text-white rounded-xl" onClick={(e) => deletePermissao(e, permissao?.id ?? 0)}>X</button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-500 text-center p-3 dark:text-white">Nenhuma permissão encontrada</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
