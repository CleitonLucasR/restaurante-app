import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { listarProdutos } from '@/api/produtos';
import { registrarEntrada, listarMovimentacoesEmpresa } from '@/api/estoque';
import type { Produto } from '@/types/produto';
import type { MovimentacaoEstoque } from '@/types/estoque';

export function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [dialogAberto, setDialogAberto] = useState(false);

  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [motivo, setMotivo] = useState('');

  async function carregar() {
    setCarregando(true);
    try {
      const [produtosData, movimentacoesData] = await Promise.all([
        listarProdutos(),
        listarMovimentacoesEmpresa(),
      ]);
      setProdutos(produtosData);
      setMovimentacoes(movimentacoesData);
    } catch {
      setErro('Não foi possível carregar os dados de estoque');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleRegistrarEntrada(e: React.FormEvent) {
    e.preventDefault();
    try {
      await registrarEntrada(produtoId, {
        quantidade: Number(quantidade),
        motivo: motivo || undefined,
      });
      setProdutoId('');
      setQuantidade('');
      setMotivo('');
      setDialogAberto(false);
      carregar();
    } catch (err: any) {
      setErro(err.response?.data?.message ?? 'Erro ao registrar entrada');
    }
  }

  if (carregando) return <p className="text-charcoal/60">Carregando...</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-charcoal">Estoque</h2>
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger
            render={
              <Button className="bg-primary hover:bg-primary-hover text-white">
                + Registrar entrada
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar entrada de estoque</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRegistrarEntrada} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="produto">Produto</Label>
                <Select value={produtoId} onValueChange={(value) => setProdutoId(value ?? '')}>
                  <SelectTrigger id="produto" className="w-full">
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.map((produto) => (
                      <SelectItem key={produto.id} value={produto.id}>
                        {produto.nome} (estoque atual: {produto.quantidadeEstoque})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min={1}
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo">Motivo (opcional)</Label>
                <Input
                  id="motivo"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ex: Reposição semanal"
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white">
                Registrar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {erro && <p className="text-sm text-danger">{erro}</p>}

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Motivo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movimentacoes.map((mov) => (
              <TableRow key={mov.id}>
                <TableCell>{new Date(mov.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{mov.produto?.nome ?? '-'}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      mov.tipo === 'ENTRADA'
                        ? 'bg-success/15 text-success'
                        : 'bg-danger/15 text-danger'
                    }
                  >
                    {mov.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
                  </Badge>
                </TableCell>
                <TableCell>{mov.quantidade}</TableCell>
                <TableCell className="text-charcoal/70">{mov.motivo ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {movimentacoes.length === 0 && (
          <p className="p-4 text-sm text-charcoal/60">Nenhuma movimentação registrada.</p>
        )}
      </Card>
    </div>
  );
}