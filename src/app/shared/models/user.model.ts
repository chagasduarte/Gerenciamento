export interface Usuario {
    id: number;
    nome: string;
    avatar: string;
}

export interface AuthResponse {
    token: string;
    usuario: Usuario;
}