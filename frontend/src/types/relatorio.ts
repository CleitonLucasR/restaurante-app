export interface RelatorioFaturamento {
  periodo: { inicio: string; fim: string };
  totalComandas: number;
  faturamentoTotal: number;
}

export interface RelatorioTicketMedio {
  periodo: { inicio: string; fim: string };
  totalComandas: number;
  ticketMedio: number;
}

export interface ProdutoMaisVendido {
  produtoId: string;
  nome: string;
  quantidade: number;
  total: number;
}