import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PeriodoRelatorioDto } from './dto/periodo-relatorio.dto';

@Injectable()
export class RelatoriosService {
  constructor(private readonly prisma: PrismaService) {}

  private getDatas(periodo: PeriodoRelatorioDto) {
    const inicio = new Date(periodo.inicio);
    const fim = new Date(periodo.fim);
    fim.setHours(23, 59, 59, 999); // inclui o dia inteiro do "fim"
    return { inicio, fim };
  }

  async faturamento(empresaId: string, periodo: PeriodoRelatorioDto) {
    const { inicio, fim } = this.getDatas(periodo);

    const comandas = await this.prisma.comanda.findMany({
      where: {
        status: 'FECHADA',
        dataFechamento: { gte: inicio, lte: fim },
        mesa: { empresaId },
      },
      include: {
        pedidos: { include: { itens: true } },
      },
    });

    const total = comandas.reduce((acc, comanda) => {
      const totalComanda = comanda.pedidos.reduce((accPedido, pedido) => {
        return (
          accPedido +
          pedido.itens.reduce(
            (accItem, item) => accItem + Number(item.precoUnitario) * item.quantidade,
            0,
          )
        );
      }, 0);
      return acc + totalComanda;
    }, 0);

    return {
      periodo: { inicio: periodo.inicio, fim: periodo.fim },
      totalComandas: comandas.length,
      faturamentoTotal: total,
    };
  }

  async ticketMedio(empresaId: string, periodo: PeriodoRelatorioDto) {
    const { faturamentoTotal, totalComandas } = await this.faturamento(empresaId, periodo);

    return {
      periodo: { inicio: periodo.inicio, fim: periodo.fim },
      totalComandas,
      ticketMedio: totalComandas > 0 ? faturamentoTotal / totalComandas : 0,
    };
  }

  async produtosMaisVendidos(empresaId: string, periodo: PeriodoRelatorioDto, limite = 10) {
    const { inicio, fim } = this.getDatas(periodo);

    const itens = await this.prisma.itemPedido.findMany({
      where: {
        produto: { empresaId },
        pedido: {
          comanda: {
            status: 'FECHADA',
            dataFechamento: { gte: inicio, lte: fim },
          },
        },
      },
      include: { produto: true },
    });

    const ranking = new Map<string, { nome: string; quantidade: number; total: number }>();

    for (const item of itens) {
      const atual = ranking.get(item.produtoId) ?? {
        nome: item.produto.nome,
        quantidade: 0,
        total: 0,
      };
      atual.quantidade += item.quantidade;
      atual.total += Number(item.precoUnitario) * item.quantidade;
      ranking.set(item.produtoId, atual);
    }

    return Array.from(ranking.entries())
      .map(([produtoId, dados]) => ({ produtoId, ...dados }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, limite);
  }
}