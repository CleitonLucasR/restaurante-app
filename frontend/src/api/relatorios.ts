import { api } from './client';
import type {
  RelatorioFaturamento,
  RelatorioTicketMedio,
  ProdutoMaisVendido,
} from '@/types/relatorio';

export async function buscarFaturamento(inicio: string, fim: string) {
  const { data } = await api.get<RelatorioFaturamento>('/relatorios/faturamento', {
    params: { inicio, fim },
  });
  return data;
}

export async function buscarTicketMedio(inicio: string, fim: string) {
  const { data } = await api.get<RelatorioTicketMedio>('/relatorios/ticket-medio', {
    params: { inicio, fim },
  });
  return data;
}

export async function buscarProdutosMaisVendidos(inicio: string, fim: string) {
  const { data } = await api.get<ProdutoMaisVendido[]>('/relatorios/produtos-mais-vendidos', {
    params: { inicio, fim },
  });
  return data;
}