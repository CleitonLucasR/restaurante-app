import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoriaDto: CreateCategoriaDto) {
    return this.prisma.categoria.create({
      data: createCategoriaDto,
    });
  }

  findAll(empresaId: string) {
    return this.prisma.categoria.findMany({
      where: { empresaId },
    });
  }

  async findOne(id: string) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
    });

    if(!categoria){
      throw new NotFoundException(`Categoria com id ${id} não encontrada`)
    }

    return categoria;
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    try {
      return await this.prisma.categoria.update({
        where: {id},
        data: updateCategoriaDto
      });
    } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'){
        throw new NotFoundException(`Categoria com o id ${id} não encontrada`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.categoria.delete({
        where: {id}
      });
    } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'){
        throw new NotFoundException(`Categoria com o id ${id} não encontrada`);
      }
      throw error;
    }
  }
}
