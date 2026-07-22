import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ComandasService {
    constructor(private readonly prisma: PrismaService) { }

    async abrir(mesaId: string, empresaId: string) {
        const mesa = await this.prisma.mesa.findUnique({
            where: { id: mesaId }
        });

        if (!mesa) {
            throw new NotFoundException(`Mesa com id ${mesaId} não encontrada`);
        }

        if (mesa.empresaId !== empresaId) {
            throw new ForbiddenException('Essa mesa não pertence à sua empresa');
        }

        if (mesa.status === 'OCUPADA') {
            throw new ConflictException('Essa mesa já possui uma comanda aberta');
        }

        return this.prisma.$transaction(async (tx) => {
            const comanda = await tx.comanda.create({
                data: {
                    mesaId,
                },
            });

            await tx.mesa.update({
                where: { id: mesaId },
                data: { status: 'OCUPADA' }
            });

            return comanda;
        });
    }

    async findOne(id: string) {
        const comanda = await this.prisma.comanda.findUnique({
            where: { id },
            include: {
                mesa: true,
                pedidos: {
                    include: {
                        itens: {
                            include: {
                                produto: true
                            }
                        }
                    }
                }
            }
        });

        if (!comanda) {
            throw new NotFoundException(`Comanda com id ${id} não encontrada`);
        }

        return comanda;
    }

    async buscarAberta(mesaId: string) {
        const comanda = await this.prisma.comanda.findFirst({
            where: {
                mesaId,
                status: 'ABERTA',
            }
        });

        if (!comanda) {
            throw new NotFoundException('Nenhuma comanda aberta para essa mesa');
        }

        return comanda;
    }

    async fechar(id: string){
        const comanda = await this.findOne(id);

        if(comanda.status === 'FECHADA'){
            throw new ConflictException('Essa comanda já está fechada');
        }

        const total = comanda.pedidos.reduce((totalComanda, pedido) =>{
            const totalPedido = pedido.itens.reduce((totalItens, item) =>{
                return totalItens + Number(item.precoUnitario) * item.quantidade;
            }, 0);
            return totalComanda + totalPedido;
        }, 0);

        return this.prisma.$transaction(async (tx) => {
            const comandafechada = await tx.comanda.update({
                where: {id},
                data: {
                    status: 'FECHADA',
                    dataFechamento: new Date(),
                },
            });

            await tx.mesa.update({
                where: {id: comanda.mesaId},
                data: {status: 'LIVRE'}
            });

            return {...comandafechada, total}
        })
    }
}
