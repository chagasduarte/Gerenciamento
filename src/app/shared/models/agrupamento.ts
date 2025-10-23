export interface AgrupamentoDetalhes {
    total_tipo: number;
    categoria: number;
}

export interface AgrupamentoResponse {
    agrupamento: AgrupamentoDetalhes[];
    soma: {
        soma: number;
    }
}