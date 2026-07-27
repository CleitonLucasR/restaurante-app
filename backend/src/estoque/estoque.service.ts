import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEntradaEstoqueDto } from './dto/create-entrada-estoque.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EstoqueService {
    constructor(private readonly prisma: PrismaService) { }

    async registrarEntrada(produtoId: string, empresaId: string, dto: CreateEntradaEstoqueDto) {
        const produto = await this.prisma.produto.findUnique({
            where: { id: produtoId }
        });

        if (!produto || produto.empresaId !== empresaId) {
            throw new NotFoundException(`Produto com id ${produtoId} não encontrado`);
        }

        return this.prisma.$transaction(async (tx) => {
            await tx.produto.update({
                where: { id: produtoId },
                data: {
                    quantidadeEstoque: { increment: dto.quantidade }
                }
            });

            return tx.movimentacaoEstoque.create({
                data: {
                    empresaId,
                    produtoId,
                    tipo: 'ENTRADA',
                    quantidade: dto.quantidade,
                    motivo: dto.motivo ?? 'Reposicao de estoque'
                }
            });
        });
    }

    async listarPorProduto(produtoId: string, empresaId: string) {
        const produto = await this.prisma.produto.findUnique({
            where: { id: produtoId }
        });

        if (!produto || produto.empresaId !== empresaId) {
            throw new NotFoundException(`Produto com id ${produtoId} não encontrado`);
        }

        return this.prisma.movimentacaoEstoque.findMany({
            where: { produtoId },
            orderBy: { createdAt: 'desc' }
        });
    }

    listarPorEmpresa(empresaId: string) {
        return this.prisma.movimentacaoEstoque.findMany({
            where: { empresaId },
            include: { produto: true },
            orderBy: { createdAt: 'desc' }
        });
    }
}
