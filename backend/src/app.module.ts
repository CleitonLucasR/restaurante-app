import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ProdutosModule } from './produtos/produtos.module';
import { AuthModule } from './auth/auth.module';
import { MesasModule } from './mesas/mesas.module';
import { ComandasModule } from './comandas/comandas.module';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [PrismaModule, CategoriasModule, ProdutosModule, AuthModule, MesasModule, ComandasModule, PedidosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
