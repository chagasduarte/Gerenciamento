export interface Planejamento {
  id?: number;
  categoriaid: number;
  subcategoriaid: number;
  categoria: string;
  subcategoria?: string;
  valor: number;
  tipo: string;
  data: Date;
}