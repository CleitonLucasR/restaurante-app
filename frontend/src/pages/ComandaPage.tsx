import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { buscarComanda, fecharComanda } from '@/api/comandas';
import { criarPedido } from '@/api/pedidos';
import { listarProdutos } from '@/api/produtos';
import type { ComandaDetalhada, ItemPedidoPayload } from '@/types/pedido';
import type { Produto } from '@/types/produto';

interface ItemNovoPedido extends ItemPedidoPayload {
    nome: string;
    preco: number;
}

export function ComandaPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [comanda, setComanda] = useState<ComandaDetalhada | null>(null);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [quantidade, setQuantidade] = useState('1');
    const [novosItens, setNovosItens] = useState<ItemNovoPedido[]>([]);
    const [enviandoPedido, setEnviandoPedido] = useState(false);

    async function carregarDados() {
        if (!id) return;
        setCarregando(true);
        try {
            const [comandaData, produtosData] = await Promise.all([
                buscarComanda(id),
                listarProdutos(),
            ]);
            setComanda(comandaData);
            setProdutos(produtosData);
        } catch {
            setErro('Não foi possível carregar a comanda');
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarDados();
    }, [id]);

    function adicionarItemNaLista() {
        const produto = produtos.find((p) => p.id === produtoSelecionado);
        if (!produto || Number(quantidade) < 1) return;

        setNovosItens((atual) => [
            ...atual,
            {
                produtoId: produto.id,
                nome: produto.nome,
                preco: Number(produto.preco),
                quantidade: Number(quantidade),
            },
        ]);
        setProdutoSelecionado('');
        setQuantidade('1');
    }

    function removerItemDaLista(index: number) {
        setNovosItens((atual) => atual.filter((_, i) => i !== index));
    }

    async function handleEnviarPedido() {
        if (!id || novosItens.length === 0) return;
        setEnviandoPedido(true);
        setErro('');
        try {
            await criarPedido(
                id,
                novosItens.map(({ produtoId, quantidade }) => ({ produtoId, quantidade })),
            );
            setNovosItens([]);
            carregarDados();
        } catch (err: any) {
            setErro(err.response?.data?.message ?? 'Erro ao enviar pedido');
        } finally {
            setEnviandoPedido(false);
        }
    }

    async function handleFecharComanda() {
        if (!id) return;
        try {
            await fecharComanda(id);
            navigate('/');
        } catch {
            setErro('Não foi possível fechar a comanda');
        }
    }

    if (carregando) return <p className="text-charcoal/60">Carregando...</p>;
    if (!comanda) return <p className="text-danger">Comanda não encontrada</p>;

    const totalGeral = comanda.pedidos.reduce(
        (acc, pedido) =>
            acc +
            pedido.itens.reduce(
                (accItem, item) => accItem + Number(item.precoUnitario) * item.quantidade,
                0,
            ),
        0,
    );

    const totalNovoPedido = novosItens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-display text-lg font-semibold text-charcoal">
                        Mesa {comanda.mesa.numero}
                    </h2>
                    <Badge className={comanda.status === 'ABERTA' ? 'bg-success/15 text-success' : 'bg-charcoal/10'}>
                        {comanda.status === 'ABERTA' ? 'Aberta' : 'Fechada'}
                    </Badge>
                </div>
                {comanda.status === 'ABERTA' && (
                    <Button variant="outline" onClick={handleFecharComanda}>
                        Fechar conta
                    </Button>
                )}
            </div>

            {erro && <p className="text-sm text-danger">{erro}</p>}

            {/* Pedidos já feitos */}
            <Card className="space-y-4 p-6">
                <h3 className="font-medium text-charcoal">Pedidos</h3>
                {comanda.pedidos.length === 0 && (
                    <p className="text-sm text-charcoal/60">Nenhum pedido ainda.</p>
                )}
                {comanda.pedidos.map((pedido) => (
                    <div key={pedido.id} className="space-y-2">
                        <p className="text-sm font-medium text-charcoal/70">Rodada {pedido.rodada}</p>
                        {pedido.itens.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm text-charcoal">
                                <span>
                                    {item.quantidade}x {item.produto.nome}
                                </span>
                                <span>R$ {(Number(item.precoUnitario) * item.quantidade).toFixed(2)}</span>
                            </div>
                        ))}
                        <Separator />
                    </div>
                ))}
                <div className="flex justify-between font-semibold text-charcoal">
                    <span>Total</span>
                    <span>R$ {totalGeral.toFixed(2)}</span>
                </div>
            </Card>

            {/* Novo pedido */}
            {comanda.status === 'ABERTA' && (
                <Card className="space-y-4 p-6">
                    <h3 className="font-medium text-charcoal">Novo pedido</h3>

                    <div className="flex gap-2">
                        <Select
                            value={produtoSelecionado}
                            onValueChange={(value) => setProdutoSelecionado(value ?? '')}
                        >
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Selecione um produto" />
                            </SelectTrigger>
                            <SelectContent>
                                {produtos.map((produto) => (
                                    <SelectItem key={produto.id} value={produto.id}>
                                        {produto.nome} — R$ {Number(produto.preco).toFixed(2)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            min={1}
                            className="w-20"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                        />
                        <Button onClick={adicionarItemNaLista} variant="outline">
                            Adicionar
                        </Button>
                    </div>

                    {novosItens.length > 0 && (
                        <div className="space-y-2">
                            {novosItens.map((item, index) => (
                                <div key={index} className="flex items-center justify-between text-sm text-charcoal">
                                    <span>
                                        {item.quantidade}x {item.nome}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                                        <button
                                            onClick={() => removerItemDaLista(index)}
                                            className="text-danger hover:underline"
                                        >
                                            remover
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <Separator />
                            <div className="flex justify-between text-sm font-medium text-charcoal">
                                <span>Subtotal</span>
                                <span>R$ {totalNovoPedido.toFixed(2)}</span>
                            </div>
                            <Button
                                onClick={handleEnviarPedido}
                                disabled={enviandoPedido}
                                className="w-full bg-primary hover:bg-primary-hover text-white"
                            >
                                {enviandoPedido ? 'Enviando...' : 'Enviar pedido'}
                            </Button>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}