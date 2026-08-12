import type { Produto } from './produto';

export interface ItemPedido {
  id: string;
  quantidade: number;
  precoUnitario: string;
  produto: Produto;
}

export interface Pedido {
  id: string;
  rodada: number;
  itens: ItemPedido[];
}

export interface ComandaDetalhada {
  id: string;
  status: 'ABERTA' | 'FECHADA';
  mesa: { id: string; numero: number };
  pedidos: Pedido[];
}

export interface ItemPedidoPayload {
  produtoId: string;
  quantidade: number;
}