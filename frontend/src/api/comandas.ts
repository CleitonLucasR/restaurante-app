import { api } from './client';
import type { Comanda } from '@/types/comanda';
import type { ComandaDetalhada } from '@/types/pedido';

export async function abrirComanda(mesaId: string): Promise<Comanda> {
  const { data } = await api.post<Comanda>(`/mesas/${mesaId}/comandas`, {});
  return data;
}

export async function buscarComandaAberta(mesaId: string): Promise<Comanda> {
  const { data } = await api.get<Comanda>(`/mesas/${mesaId}/comandas/aberta`);
  return data;
}

export async function buscarComanda(id: string): Promise<ComandaDetalhada> {
  const { data } = await api.get<ComandaDetalhada>(`/comandas/${id}`);
  return data;
}

export async function fecharComanda(id: string) {
  const { data } = await api.patch(`/comandas/${id}/fechar`);
  return data;
}