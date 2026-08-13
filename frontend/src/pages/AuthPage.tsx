import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { login, register } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export function AuthPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', senha: '' });
  const [registerForm, setRegisterForm] = useState({
    nomeEmpresa: '',
    cnpj: '',
    emailEmpresa: '',
    nomeUsuario: '',
    emailUsuario: '',
    senha: '',
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const data = await login(loginForm);
      setAuth(data.usuario, data.accessToken);
      navigate('/');
    } catch {
      setErro('E-mail ou senha inválidos');
    } finally {
      setCarregando(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const data = await register(registerForm);
      setAuth(data.usuario, data.accessToken);
      navigate('/');
    } catch (err: any) {
      const mensagem = err.response?.data?.message;
      setErro(Array.isArray(mensagem) ? mensagem.join(', ') : mensagem ?? 'Erro ao registrar');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-charcoal">
            Restaurante App
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Registrar empresa</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={loginForm.senha}
                    onChange={(e) => setLoginForm({ ...loginForm, senha: e.target.value })}
                    required
                  />
                </div>
                {erro && <p className="text-sm text-danger">{erro}</p>}
                <Button
                  type="submit"
                  disabled={carregando}
                  className="w-full bg-primary hover:bg-primary-hover text-white"
                >
                  {carregando ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeEmpresa">Nome da empresa</Label>
                  <Input
                    id="nomeEmpresa"
                    value={registerForm.nomeEmpresa}
                    onChange={(e) => setRegisterForm({ ...registerForm, nomeEmpresa: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={registerForm.cnpj}
                    onChange={(e) => setRegisterForm({ ...registerForm, cnpj: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailEmpresa">E-mail da empresa</Label>
                  <Input
                    id="emailEmpresa"
                    type="email"
                    value={registerForm.emailEmpresa}
                    onChange={(e) => setRegisterForm({ ...registerForm, emailEmpresa: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomeUsuario">Seu nome</Label>
                  <Input
                    id="nomeUsuario"
                    value={registerForm.nomeUsuario}
                    onChange={(e) => setRegisterForm({ ...registerForm, nomeUsuario: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailUsuario">Seu e-mail</Label>
                  <Input
                    id="emailUsuario"
                    type="email"
                    value={registerForm.emailUsuario}
                    onChange={(e) => setRegisterForm({ ...registerForm, emailUsuario: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senhaRegister">Senha</Label>
                  <Input
                    id="senhaRegister"
                    type="password"
                    value={registerForm.senha}
                    onChange={(e) => setRegisterForm({ ...registerForm, senha: e.target.value })}
                    required
                  />
                </div>
                {erro && <p className="text-sm text-danger">{erro}</p>}
                <Button
                  type="submit"
                  disabled={carregando}
                  className="w-full bg-primary hover:bg-primary-hover text-white"
                >
                  {carregando ? 'Registrando...' : 'Registrar'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}