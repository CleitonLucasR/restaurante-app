import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';

@Injectable()
export class MesasService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createMesaDto: CreateMesaDto, empresaId: string) {
    try {
      return await this.prisma.mesa.create({
        data: {
          ...createMesaDto,
          empresaId
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`Já existe uma mesa com o número ${createMesaDto.numero}`,)
      }

      throw error;
    };
  }

  findAll(empresaId: string) {
    return this.prisma.mesa.findMany({
      where: { empresaId },
      orderBy: { numero: 'asc' }
    })
  }

  async findOne(id: string) {
    const mesa = await this.prisma.mesa.findUnique({
      where: { id }
    })

    if (!mesa) {
      throw new NotFoundException(`Mesa com id ${id} não encontrada`)
    }

    return mesa
  }

  async update(id: string, updateMesaDto: UpdateMesaDto) {
    try {
      return await this.prisma.mesa.update({
        where: { id },
        data: updateMesaDto
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Mesa com id ${id} não encontrada`);
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`Já existe uma mesa com esse número`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.mesa.delete({
        where: { id }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Mesa com id ${id} não encontrada`);
      }
      throw error;
    }
  }
}
