import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { listarCategorias, criarCategoria, deletarCategoria } from '@/api/categorias';
import type { Categoria } from '@/types/produto';

export function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [nome, setNome] = useState('');
  const [dialogAberto, setDialogAberto] = useState(false);

  async function carregar() {
    setCarregando(true);
    try {
      setCategorias(await listarCategorias());
    } catch {
      setErro('Não foi possível carregar as categorias');
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
      await criarCategoria({ nome });
      setNome('');
      setDialogAberto(false);
      carregar();
    } catch (err: any) {
      setErro(err.response?.data?.message ?? 'Erro ao criar categoria');
    }
  }

  async function handleDeletar(id: string) {
    try {
      await deletarCategoria(id);
      carregar();
    } catch {
      setErro('Não foi possível excluir (verifique se há produtos vinculados)');
    }
  }

  if (carregando) return <p className="text-charcoal/60">Carregando...</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-charcoal">Categorias</h2>
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger
            render={
              <Button className="bg-primary hover:bg-primary-hover text-white">
                + Nova categoria
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova categoria</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCriar} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white">
                Criar
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
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow key={categoria.id}>
                <TableCell>{categoria.nome}</TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleDeletar(categoria.id)}
                    className="text-sm text-danger hover:underline"
                  >
                    excluir
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {categorias.length === 0 && (
          <p className="p-4 text-sm text-charcoal/60">Nenhuma categoria cadastrada.</p>
        )}
      </Card>
    </div>
  );
}