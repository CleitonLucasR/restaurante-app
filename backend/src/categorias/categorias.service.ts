import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  findOne(id: string) {
    const categoria = this.prisma.categoria.findUnique({
      where: { id },
    });

    if(!categoria){
      throw new NotFoundException(`Categoria com id ${id} não encontrada`)
    }

    return categoria
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    await this.findOne(id);

    return this.prisma.categoria.update({
      where: {id},
      data: updateCategoriaDto,
    })
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.categoria.delete({
      where: {id},
    })
  }
}
