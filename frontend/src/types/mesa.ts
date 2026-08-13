export type StatusMesa = 'LIVRE' | 'OCUPADA';

export interface Mesa {
  id: string;
  numero: number;
  status: StatusMesa;
  empresaId: string;
}