export interface Categoria {
  id: string;
  nome: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string | null;
  preco: string;
  quantidadeEstoque: number;
  ativo: boolean;
  categoriaId: string;
  categoria?: Categoria;
}

export interface ProdutoPayload {
  nome: string;
  descricao?: string;
  preco: number;
  quantidadeEstoque?: number;
  categoriaId: string;
}

export interface CategoriaPayload {
  nome: string;
}