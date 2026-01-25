import { AgrupamentoResponse } from "../../shared/models/agrupamento";

export function agruparPorCategoria(apiResponse: AgrupamentoResponse) {
  const dados: any = {};

  apiResponse.agrupamento.forEach(item => {
    const idCategoria = item.idcategoria;
    const idSubcategoria = item.subcategoria;
    const valor = Number(item.total_tipo);

    // Cria categoria se não existir
    if (!dados[idCategoria]) {
      dados[idCategoria] = {
        soma: 0,
        subcategorias: {}
      };
    }

    // Soma no total da categoria
    dados[idCategoria].soma += valor;

    // Cria subcategoria se não existir
    if (!dados[idCategoria].subcategorias[idSubcategoria]) {
      dados[idCategoria].subcategorias[idSubcategoria] = {
        soma: 0
      };
    }

    // Soma na subcategoria
    dados[idCategoria].subcategorias[idSubcategoria].soma += valor;
  });

  return dados;
}
