import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { listarMesas, criarMesa } from '@/api/mesas';
import { abrirComanda, buscarComandaAberta } from '@/api/comandas';
import type { Mesa } from '@/types/mesa';

export function HomePage() {
    const navigate = useNavigate();
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [novoNumero, setNovoNumero] = useState('');
    const [dialogAberto, setDialogAberto] = useState(false);

    async function carregarMesas() {
        setCarregando(true);
        try {
            const data = await listarMesas();
            setMesas(data.sort((a, b) => a.numero - b.numero));
        } catch {
            setErro('Não foi possível carregar as mesas');
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarMesas();
    }, []);

    async function handleCriarMesa(e: React.FormEvent) {
        e.preventDefault();
        try {
            await criarMesa(Number(novoNumero));
            setNovoNumero('');
            setDialogAberto(false);
            carregarMesas();
        } catch (err: any) {
            setErro(err.response?.data?.message ?? 'Erro ao criar mesa');
        }
    }

    async function handleClickMesa(mesa: Mesa) {
        try {
            if (mesa.status === 'LIVRE') {
                const comanda = await abrirComanda(mesa.id);
                navigate(`/comandas/${comanda.id}`);
            } else {
                const comanda = await buscarComandaAberta(mesa.id);
                navigate(`/comandas/${comanda.id}`);
            }
        } catch {
            setErro('Não foi possível abrir a mesa');
        }
    }

    if (carregando) {
        return <p className="text-charcoal/60">Carregando mesas...</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-charcoal">Mesas</h2>
                <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                    <DialogTrigger
                        render={
                            <Button className="bg-primary hover:bg-primary-hover text-white">
                                + Nova mesa
                            </Button>
                        }
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Cadastrar nova mesa</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCriarMesa} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="numero">Número da mesa</Label>
                                <Input
                                    id="numero"
                                    type="number"
                                    min={1}
                                    value={novoNumero}
                                    onChange={(e) => setNovoNumero(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white">
                                Criar
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {erro && <p className="text-sm text-danger">{erro}</p>}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {mesas.map((mesa) => (
                    <Card
                        key={mesa.id}
                        onClick={() => handleClickMesa(mesa)}
                        className="flex cursor-pointer flex-col items-center justify-center gap-2 p-6 transition hover:shadow-md"
                    >
                        <span className="font-display text-2xl font-semibold text-charcoal">
                            {mesa.numero}
                        </span>
                        <Badge
                            className={
                                mesa.status === 'LIVRE'
                                    ? 'bg-success/15 text-success'
                                    : 'bg-danger/15 text-danger'
                            }
                        >
                            {mesa.status === 'LIVRE' ? 'Livre' : 'Ocupada'}
                        </Badge>
                    </Card>
                ))}
            </div>

            {mesas.length === 0 && (
                <p className="text-charcoal/60">Nenhuma mesa cadastrada ainda.</p>
            )}
        </div>
    );
}