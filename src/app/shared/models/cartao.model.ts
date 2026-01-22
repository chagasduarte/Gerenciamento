export interface Cartao {
    id: number;
    nome: string;
    dia_fatura: number;
    userid: number;
    limite: number;
    dia_vencimento?: number;
}