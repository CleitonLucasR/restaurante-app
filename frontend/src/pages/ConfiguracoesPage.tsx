import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { buscarEmpresa, atualizarEmpresa, atualizarSenha } from '@/api/configuracoes';

export function ConfiguracoesPage() {
  const [carregando, setCarregando] = useState(true);
  const [erroEmpresa, setErroEmpresa] = useState('');
  const [sucessoEmpresa, setSucessoEmpresa] = useState('');
  const [salvandoEmpresa, setSalvandoEmpresa] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cnpj, setCnpj] = useState('');

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [sucessoSenha, setSucessoSenha] = useState('');
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  useEffect(() => {
    buscarEmpresa()
      .then((empresa) => {
        setNome(empresa.nome);
        setEmail(empresa.email);
        setCnpj(empresa.cnpj);
      })
      .catch(() => setErroEmpresa('Não foi possível carregar os dados da empresa'))
      .finally(() => setCarregando(false));
  }, []);

  async function handleSalvarEmpresa(e: React.FormEvent) {
    e.preventDefault();
    setSalvandoEmpresa(true);
    setErroEmpresa('');
    setSucessoEmpresa('');
    try {
      await atualizarEmpresa({ nome, email });
      setSucessoEmpresa('Dados atualizados com sucesso');
    } catch (err: any) {
      setErroEmpresa(err.response?.data?.message ?? 'Erro ao atualizar dados');
    } finally {
      setSalvandoEmpresa(false);
    }
  }

  async function handleTrocarSenha(e: React.FormEvent) {
    e.preventDefault();
    setSalvandoSenha(true);
    setErroSenha('');
    setSucessoSenha('');
    try {
      await atualizarSenha({ senhaAtual, novaSenha });
      setSucessoSenha('Senha atualizada com sucesso');
      setSenhaAtual('');
      setNovaSenha('');
    } catch (err: any) {
      const mensagem = err.response?.data?.message;
      setErroSenha(Array.isArray(mensagem) ? mensagem.join(', ') : mensagem ?? 'Erro ao trocar senha');
    } finally {
      setSalvandoSenha(false);
    }
  }

  if (carregando) return <p className="text-charcoal/60">Carregando...</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="font-display text-lg font-semibold text-charcoal">Configurações</h2>

      <Card className="space-y-4 p-6">
        <h3 className="font-medium text-charcoal">Dados da empresa</h3>
        <form onSubmit={handleSalvarEmpresa} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" value={cnpj} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {erroEmpresa && <p className="text-sm text-danger">{erroEmpresa}</p>}
          {sucessoEmpresa && <p className="text-sm text-success">{sucessoEmpresa}</p>}
          <Button
            type="submit"
            disabled={salvandoEmpresa}
            className="bg-primary hover:bg-primary-hover text-white"
          >
            {salvandoEmpresa ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </form>
      </Card>

      <Separator />

      <Card className="space-y-4 p-6">
        <h3 className="font-medium text-charcoal">Trocar senha</h3>
        <form onSubmit={handleTrocarSenha} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="senhaAtual">Senha atual</Label>
            <Input
              id="senhaAtual"
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="novaSenha">Nova senha</Label>
            <Input
              id="novaSenha"
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
          </div>
          {erroSenha && <p className="text-sm text-danger">{erroSenha}</p>}
          {sucessoSenha && <p className="text-sm text-success">{sucessoSenha}</p>}
          <Button
            type="submit"
            disabled={salvandoSenha}
            className="bg-primary hover:bg-primary-hover text-white"
          >
            {salvandoSenha ? 'Salvando...' : 'Trocar senha'}
          </Button>
        </form>
      </Card>
    </div>
  );
}