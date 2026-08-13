import { api } from './client';
import type { Empresa, UpdateEmpresaPayload, UpdateSenhaPayload } from '@/types/configuracoes';

export async function buscarEmpresa(): Promise<Empresa> {
  const { data } = await api.get<Empresa>('/configuracoes/empresa');
  return data;
}

export async function atualizarEmpresa(payload: UpdateEmpresaPayload): Promise<Empresa> {
  const { data } = await api.patch<Empresa>('/configuracoes/empresa', payload);
  return data;
}

export async function atualizarSenha(payload: UpdateSenhaPayload) {
  const { data } = await api.patch('/configuracoes/senha', payload);
  return data;
}