import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { PeriodoRelatorioDto } from './dto/periodo-relatorio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';

@Controller('relatorios')
@UseGuards(JwtAuthGuard)
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('faturamento')
  faturamento(@Query() periodo: PeriodoRelatorioDto, @CurrentUser() user: CurrentUserData) {
    return this.relatoriosService.faturamento(user.empresaId, periodo);
  }

  @Get('ticket-medio')
  ticketMedio(@Query() periodo: PeriodoRelatorioDto, @CurrentUser() user: CurrentUserData) {
    return this.relatoriosService.ticketMedio(user.empresaId, periodo);
  }

  @Get('produtos-mais-vendidos')
  produtosMaisVendidos(@Query() periodo: PeriodoRelatorioDto, @CurrentUser() user: CurrentUserData) {
    return this.relatoriosService.produtosMaisVendidos(user.empresaId, periodo);
  }
}