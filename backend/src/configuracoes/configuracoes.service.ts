import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { UpdateSenhaDto } from './dto/update-senha.dto';

@Injectable()
export class ConfiguracoesService {
  constructor(private readonly prisma: PrismaService) {}

  async getEmpresa(empresaId: string) {
    const empresa = await this.prisma.empresa.findUnique({ where: { id: empresaId } });
    if (!empresa) throw new NotFoundException('Empresa não encontrada');
    return empresa;
  }

  async updateEmpresa(empresaId: string, dto: UpdateEmpresaDto) {
    return this.prisma.empresa.update({
      where: { id: empresaId },
      data: dto,
    });
  }

  async updateSenha(userId: string, dto: UpdateSenhaDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id: userId } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const senhaValida = await bcrypt.compare(dto.senhaAtual, usuario.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    const novaSenhaHash = await bcrypt.hash(dto.novaSenha, 10);

    await this.prisma.usuario.update({
      where: { id: userId },
      data: { senhaHash: novaSenhaHash },
    });

    return { message: 'Senha atualizada com sucesso' };
  }
}