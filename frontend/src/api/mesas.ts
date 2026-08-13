import { api } from './client';
import type { Mesa } from '@/types/mesa';

export async function listarMesas(): Promise<Mesa[]> {
  const { data } = await api.get<Mesa[]>('/mesas');
  return data;
}

export async function criarMesa(numero: number): Promise<Mesa> {
  const { data } = await api.post<Mesa>('/mesas', { numero });
  return data;
}