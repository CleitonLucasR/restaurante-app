export type StatusComanda = 'ABERTA' | 'FECHADA';

export interface Comanda {
  id: string;
  status: StatusComanda;
  mesaId: string;
  dataAbertura: string;
  dataFechamento: string | null;
}