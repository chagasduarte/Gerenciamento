import { TransacaoModel } from "./despesa.model";

export interface PordiaResponse {
  soma: Soma;
  result: TransacaoModel[];
}

export interface Soma {
  soma: number;
}
