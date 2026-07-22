import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { CurrentUserData } from 'src/auth/decorators/current-user.decorator';
import { MesasService } from './mesas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';

@Controller('mesas')
@UseGuards(JwtAuthGuard)
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Post()
  create(@Body() createMesaDto: CreateMesaDto, @CurrentUser() user: CurrentUserData) {
    return this.mesasService.create(createMesaDto, user.empresaId);
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserData) {
    return this.mesasService.findAll(user.empresaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mesasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMesaDto: UpdateMesaDto) {
    return this.mesasService.update(id, updateMesaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mesasService.remove(id);
  }
}
