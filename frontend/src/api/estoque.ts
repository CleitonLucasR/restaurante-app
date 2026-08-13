import { api } from './client';
import type { MovimentacaoEstoque, EntradaEstoquePayload } from '@/types/estoque';

export async function registrarEntrada(produtoId: string, payload: EntradaEstoquePayload) {
  const { data } = await api.post(`/produtos/${produtoId}/estoque/entrada`, payload);
  return data;
}

export async function listarMovimentacoesEmpresa(): Promise<MovimentacaoEstoque[]> {
  const { data } = await api.get<MovimentacaoEstoque[]>('/estoque/movimentacoes');
  return data;
}