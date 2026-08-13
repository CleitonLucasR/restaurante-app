import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { listarProdutos, criarProduto, deletarProduto } from '@/api/produtos';
import { listarCategorias } from '@/api/categorias';
import type { Produto, Categoria } from '@/types/produto';

export function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [dialogAberto, setDialogAberto] = useState(false);

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidadeEstoque: '0',
    categoriaId: '',
  });

  async function carregar() {
    setCarregando(true);
    try {
      const [produtosData, categoriasData] = await Promise.all([
        listarProdutos(),
        listarCategorias(),
      ]);
      setProdutos(produtosData);
      setCategorias(categoriasData);
    } catch {
      setErro('Não foi possível carregar os dados');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    try {
      await criarProduto({
        nome: form.nome,
        descricao: form.descricao || undefined,
        preco: Number(form.preco),
        quantidadeEstoque: Number(form.quantidadeEstoque),
        categoriaId: form.categoriaId,
      });
      setForm({ nome: '', descricao: '', preco: '', quantidadeEstoque: '0', categoriaId: '' });
      setDialogAberto(false);
      carregar();
    } catch (err: any) {
      const mensagem = err.response?.data?.message;
      setErro(Array.isArray(mensagem) ? mensagem.join(', ') : mensagem ?? 'Erro ao criar produto');
    }
  }

  async function handleDeletar(id: string) {
    try {
      await deletarProduto(id);
      carregar();
    } catch {
      setErro('Não foi possível excluir o produto');
    }
  }

  if (carregando) return <p className="text-charcoal/60">Carregando...</p>;

  const semCategorias = categorias.length === 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-charcoal">Produtos</h2>
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger
            render={
              <Button
                disabled={semCategorias}
                className="bg-primary hover:bg-primary-hover text-white"
              >
                + Novo produto
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo produto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCriar} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    min={0}
                    value={form.preco}
                    onChange={(e) => setForm({ ...form, preco: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidadeEstoque">Estoque inicial</Label>
                  <Input
                    id="quantidadeEstoque"
                    type="number"
                    min={0}
                    value={form.quantidadeEstoque}
                    onChange={(e) => setForm({ ...form, quantidadeEstoque: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={form.categoriaId}
                  onValueChange={(value) => setForm({ ...form, categoriaId: value ?? '' })}
                >
                  <SelectTrigger id="categoria" className="w-full">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white">
                Criar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {semCategorias && (
        <p className="text-sm text-warning">
          Cadastre ao menos uma categoria antes de criar produtos.
        </p>
      )}

      {erro && <p className="text-sm text-danger">{erro}</p>}

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtos.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>{produto.categoria?.nome ?? '-'}</TableCell>
                <TableCell>R$ {Number(produto.preco).toFixed(2)}</TableCell>
                <TableCell>{produto.quantidadeEstoque}</TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleDeletar(produto.id)}
                    className="text-sm text-danger hover:underline"
                  >
                    excluir
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {produtos.length === 0 && (
          <p className="p-4 text-sm text-charcoal/60">Nenhum produto cadastrado.</p>
        )}
      </Card>
    </div>
  );
}