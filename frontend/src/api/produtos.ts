import { api } from './client';
import type { Produto, ProdutoPayload } from '@/types/produto';

export async function listarProdutos(): Promise<Produto[]> {
  const { data } = await api.get<Produto[]>('/produtos');
  return data;
}

export async function criarProduto(payload: ProdutoPayload): Promise<Produto> {
  const { data } = await api.post<Produto>('/produtos', payload);
  return data;
}

export async function deletarProduto(id: string): Promise<void> {
  await api.delete(`/produtos/${id}`);
}