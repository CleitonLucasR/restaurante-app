import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [PrismaModule, CategoriasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
