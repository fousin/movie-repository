export type Filme ={
    id: number;
    titulo: string;
    sinopse: string;
    url_capa: string;
    url_filme: string;
}

export type Arquivo = {
    id?: number;
    name?: string;
    url?: string;
    type?: string;
    created_at?: string;
}

export type User = {
    id?: number;
    name?: string;
    email?: string;
    permissoes?: Permissao[];
}

export type Role = {
    id?: number;
    name?: string;
}

export type Permissao = {
    id?: number;
    user?: User;
    role?:Role;
    user_id?: number | null;
    role_id?: number;

}