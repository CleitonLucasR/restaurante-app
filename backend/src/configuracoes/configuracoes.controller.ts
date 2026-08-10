import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ConfiguracoesService } from './configuracoes.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { UpdateSenhaDto } from './dto/update-senha.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';

@Controller('configuracoes')
@UseGuards(JwtAuthGuard)
export class ConfiguracoesController {
  constructor(private readonly configuracoesService: ConfiguracoesService) {}

  @Get('empresa')
  getEmpresa(@CurrentUser() user: CurrentUserData) {
    return this.configuracoesService.getEmpresa(user.empresaId);
  }

  @Patch('empresa')
  updateEmpresa(@Body() dto: UpdateEmpresaDto, @CurrentUser() user: CurrentUserData) {
    return this.configuracoesService.updateEmpresa(user.empresaId, dto);
  }

  @Patch('senha')
  updateSenha(@Body() dto: UpdateSenhaDto, @CurrentUser() user: CurrentUserData) {
    return this.configuracoesService.updateSenha(user.userId, dto);
  }
}