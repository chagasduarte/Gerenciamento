export interface AgrupamentoDetalhes {
    total_tipo: number;
    idcategoria: number;
    subcategoria: number;
}

export interface AgrupamentoResponse {
    agrupamento: AgrupamentoDetalhes[];
    soma: {
        soma: number;
    }
}