export class TransacaoModel {
    id!: number
    descricao!: string
    tipo!: string
    valor!: number
    categoria!: number
    idcategoria?: number;
    data!: Date
    status!: string
    criado_em!: Date
    ispaycart!: boolean;
    cartaoid!: number | null;
    pagamento?: Date;
    adicionada?: boolean;
    selecionado?: boolean;
}

export interface Transacoes {
    soma_parcelados: number;
    soma_adicionais: number;
    soma_pagos: number;
    parceladas: TransacaoModel[];
    adicionais: TransacaoModel[];
    pagos: TransacaoModel[];
}

export interface Parcelas {
    despesa: TransacaoModel[];
    soma: number;
}