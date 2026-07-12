import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProdutoDto: CreateProdutoDto) {
    await this.validarCategoriaExiste(createProdutoDto.categoriaId);

    return this.prisma.produto.create({
      data: createProdutoDto
    })
  }

  findAll(empresaId: string) {
    return this.prisma.produto.findMany({
      where: { empresaId }, 
      include: { categoria: true}
    })
  }

  async findOne(id: string) {
    const produto = await this.prisma.produto.findUnique(({
      where: { id },
      include: { categoria: true }      
    }));

    if(!produto){
      throw new NotFoundException(`Produto com id ${id} não encontrado`);
    }

    return produto;
  }

  async update(id: string, updateProdutoDto: UpdateProdutoDto) {
    if(updateProdutoDto.categoriaId){
      await this.validarCategoriaExiste(updateProdutoDto.categoriaId);
    }

    try {
      return await this.prisma.produto.update({
        where: {id},
        data: updateProdutoDto
      });
    } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'){
        throw new NotFoundException (`Produto com id ${id} não encontrado`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.produto.delete({
        where: {id}
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Produto com id ${id} não encontrado`);
      }
      throw error;
    }
  }

  private async validarCategoriaExiste(categoriaId: string){
    const categoria = await this.prisma.categoria.findUnique({
      where: {id: categoriaId},
    })

    if(!categoria){
      throw new NotFoundException(`Categoria com id ${categoriaId} não encontrada`);
    }
  }
}
