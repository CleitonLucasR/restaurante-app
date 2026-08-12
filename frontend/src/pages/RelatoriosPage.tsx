import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { buscarFaturamento, buscarTicketMedio, buscarProdutosMaisVendidos } from '@/api/relatorios';
import type {
  RelatorioFaturamento,
  RelatorioTicketMedio,
  ProdutoMaisVendido,
} from '@/types/relatorio';

function primeiroDiaDoMes() {
  const data = new Date();
  return new Date(data.getFullYear(), data.getMonth(), 1).toISOString().slice(0, 10);
}

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

export function RelatoriosPage() {
  const [inicio, setInicio] = useState(primeiroDiaDoMes());
  const [fim, setFim] = useState(hoje());
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const [faturamento, setFaturamento] = useState<RelatorioFaturamento | null>(null);
  const [ticketMedio, setTicketMedio] = useState<RelatorioTicketMedio | null>(null);
  const [ranking, setRanking] = useState<ProdutoMaisVendido[]>([]);

  async function handleBuscar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    try {
      const [faturamentoData, ticketData, rankingData] = await Promise.all([
        buscarFaturamento(inicio, fim),
        buscarTicketMedio(inicio, fim),
        buscarProdutosMaisVendidos(inicio, fim),
      ]);
      setFaturamento(faturamentoData);
      setTicketMedio(ticketData);
      setRanking(rankingData);
    } catch {
      setErro('Não foi possível carregar os relatórios');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h2 className="font-display text-lg font-semibold text-charcoal">Relatórios</h2>

      <Card className="p-6">
        <form onSubmit={handleBuscar} className="flex items-end gap-4">
          <div className="space-y-2">
            <Label htmlFor="inicio">De</Label>
            <Input id="inicio" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fim">Até</Label>
            <Input id="fim" type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
          </div>
          <Button
            type="submit"
            disabled={carregando}
            className="bg-primary hover:bg-primary-hover text-white"
          >
            {carregando ? 'Buscando...' : 'Buscar'}
          </Button>
        </form>
      </Card>

      {erro && <p className="text-sm text-danger">{erro}</p>}

      {faturamento && ticketMedio && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-6">
            <p className="text-sm text-charcoal/60">Faturamento</p>
            <p className="font-display text-2xl font-semibold text-charcoal">
              R$ {faturamento.faturamentoTotal.toFixed(2)}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-charcoal/60">Comandas fechadas</p>
            <p className="font-display text-2xl font-semibold text-charcoal">
              {faturamento.totalComandas}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-charcoal/60">Ticket médio</p>
            <p className="font-display text-2xl font-semibold text-charcoal">
              R$ {ticketMedio.ticketMedio.toFixed(2)}
            </p>
          </Card>
        </div>
      )}

      {ranking.length > 0 && (
        <Card className="p-0">
          <div className="p-4 pb-0">
            <h3 className="font-medium text-charcoal">Produtos mais vendidos</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.map((item) => (
                <TableRow key={item.produtoId}>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>R$ {item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}