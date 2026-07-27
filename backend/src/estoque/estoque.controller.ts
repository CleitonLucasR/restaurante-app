import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { CreateEntradaEstoqueDto } from './dto/create-entrada-estoque.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class EstoqueController {
    constructor(private readonly estoqueService: EstoqueService) { }

    @Post('produtos/:produtoId/estoque/entrada')
    registrarEntrada(@Param('produtoId') produtoId: string, @Body() dto: CreateEntradaEstoqueDto, @CurrentUser() user: CurrentUserData) {
        return this.estoqueService.registrarEntrada(produtoId, user.empresaId, dto);
    }

    @Get('produtos/:produtoId/estoque/movimentacoes')
    listarPorProdutos(@Param('produtoId') produtoId: string, @CurrentUser() user: CurrentUserData) {
        return this.estoqueService.listarPorProduto(produtoId, user.empresaId)
    }

    @Get('estoque/movimentacoes')
    listarPorEmpresa(@CurrentUser() user: CurrentUserData) {
        return this.estoqueService.listarPorEmpresa(user.empresaId);
    }
}
