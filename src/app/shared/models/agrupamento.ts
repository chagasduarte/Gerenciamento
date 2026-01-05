export interface AgrupamentoDetalhes {
    total_tipo: number;
    categoria: number;
    idcategoria: number;
}

export interface AgrupamentoResponse {
    agrupamento: AgrupamentoDetalhes[];
    soma: {
        soma: number;
    }
}