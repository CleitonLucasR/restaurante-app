import { Controller, Post, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ComandasService } from './comandas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';


@Controller()
@UseGuards(JwtAuthGuard)
export class ComandasController {
    constructor(private readonly comandasService: ComandasService) { }

    @Post('mesas/:mesaId/comandas')
    abrir(@Param('mesaId') mesaId: string, @CurrentUser() user: CurrentUserData) {
        return this.comandasService.abrir(mesaId, user.empresaId);
    }

    @Get('mesas/:mesaId/comandas/aberta')
    buscarAberta(@Param('mesaId') mesaId: string) {
        return this.comandasService.buscarAberta(mesaId);
    }

    @Get('comandas/:id')
    findOne(@Param('id') id: string) {
        return this.comandasService.findOne(id);
    }

    @Patch('comandas/:id/fechar')
    fechar(@Param('id') id: string) {
        return this.comandasService.fechar(id);
    }
}
