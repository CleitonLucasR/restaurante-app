import { api } from './client';
import type { ItemPedidoPayload, Pedido } from '@/types/pedido';

export async function criarPedido(comandaId: string, itens: ItemPedidoPayload[]): Promise<Pedido> {
  const { data } = await api.post<Pedido>(`/comandas/${comandaId}/pedidos`, { itens });
  return data;
}