import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post('comandas/:comandaId/pedidos')
  create(
    @Param('comandaId') comandaId: string,
    @Body() createPedidoDto: CreatePedidoDto,
  ) {
    return this.pedidosService.create(comandaId, createPedidoDto);
  }

  @Get('pedidos/:id')
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(id);
  }
}