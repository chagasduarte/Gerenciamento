import { StringDecoder } from "string_decoder"

export interface TransacaoModel {
    id: number
    descricao: string
    tipo: string
    valor: number
    categoria: number
    data: Date
    status: string
    criado_em: Date
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