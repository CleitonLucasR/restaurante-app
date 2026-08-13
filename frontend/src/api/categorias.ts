import { api } from './client';
import type { Categoria, CategoriaPayload } from '@/types/produto';

export async function listarCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>('/categorias');
  return data;
}

export async function criarCategoria(payload: CategoriaPayload): Promise<Categoria> {
  const { data } = await api.post<Categoria>('/categorias', payload);
  return data;
}

export async function deletarCategoria(id: string): Promise<void> {
  await api.delete(`/categorias/${id}`);
}