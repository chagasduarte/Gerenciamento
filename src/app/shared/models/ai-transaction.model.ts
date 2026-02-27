export interface AiTransaction {
    descricao: string;
    valor: number;
    data: string; // ISO date string
    categoria_id?: number;
    tipo: 'entrada' | 'saida';
}
