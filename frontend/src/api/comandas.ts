import { api } from './client';
import type { Comanda } from '@/types/comanda';

export async function abrirComanda(mesaId: string): Promise<Comanda> {
  const { data } = await api.post<Comanda>(`/mesas/${mesaId}/comandas`, {});
  return data;
}

export async function buscarComandaAberta(mesaId: string): Promise<Comanda> {
  const { data } = await api.get<Comanda>(`/mesas/${mesaId}/comandas/aberta`);
  return data;
}