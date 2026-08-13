export interface MovimentacaoEstoque {
  id: string;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  motivo: string | null;
  createdAt: string;
  produto?: { id: string; nome: string };
}

export interface EntradaEstoquePayload {
  quantidade: number;
  motivo?: string;
}