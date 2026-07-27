import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Injectable()
export class PedidosService {
    constructor(private readonly prisma: PrismaService) { }

    async create(comandaId: string, createPedidoDto: CreatePedidoDto) {
        const comanda = await this.prisma.comanda.findUnique({
            where: { id: comandaId },
            include: { mesa: true },
        });

        if (!comanda) {
            throw new NotFoundException(`Comanda com id ${comandaId} não encontrada`);
        }

        if (comanda.status !== 'ABERTA') {
            throw new ConflictException('Não é possível adicionar pedidos a uma comanda fechada');
        }

        const produtoIds = createPedidoDto.itens.map((item) => item.produtoId);

        const produtos = await this.prisma.produto.findMany({
            where: { id: { in: produtoIds } }
        });

        for (const item of createPedidoDto.itens) {
            const produto = produtos.find((p) => p.id === item.produtoId);

            if (!produto) {
                throw new NotFoundException(`Produto com id ${item.produtoId} não encontrado`);
            }

            if (produto.empresaId !== comanda.mesa.empresaId) {
                throw new NotFoundException(`Produto com id ${item.produtoId} não encontrado`);
            }

            if (produto.quantidadeEstoque < item.quantidade) {
                throw new BadRequestException(`Estoque insuficiente para o produto "${produto.nome}". Disponível: ${produto.quantidadeEstoque}`);
            }
        }

        const totalPedidosExistentes = await this.prisma.pedido.count({
            where: { comandaId }
        });

        const proximaRodada = totalPedidosExistentes + 1;

        return this.prisma.$transaction(async (tx) => {
            const pedido = await tx.pedido.create({
                data: {
                    comandaId,
                    rodada: proximaRodada
                },
            });

            for (const item of createPedidoDto.itens) {
                const produto = produtos.find((p) => p.id === item.produtoId)!;

                await tx.itemPedido.create({
                    data: {
                        pedidoId: pedido.id,
                        produtoId: produto.id,
                        quantidade: item.quantidade,
                        precoUnitario: produto.preco,
                    },
                });

                await tx.produto.update({
                    where: { id: produto.id },
                    data: {
                        quantidadeEstoque: { decrement: item.quantidade },
                    },
                });

                await tx.movimentacaoEstoque.create({
                    data: {
                        empresaId: produto.empresaId,
                        produtoId: produto.id,
                        tipo: 'SAIDA',
                        quantidade: item.quantidade,
                        motivo: `Venda - Pedido rodada ${proximaRodada}`,
                    },
                });
            }

            return tx.pedido.findUnique({
                where: { id: pedido.id },
                include: {
                    itens: {
                        include: { produto: true },
                    },
                },
            });
        });
    }

    async findOne(id: string) {
        const pedido = await this.prisma.pedido.findUnique({
            where: { id },
            include: {
                itens: {
                    include: { produto: true },
                },
            },
        });

        if (!pedido) {
            throw new NotFoundException(`Pedido com id ${id} não encontrado`);
        }

        return pedido;
    }
}
