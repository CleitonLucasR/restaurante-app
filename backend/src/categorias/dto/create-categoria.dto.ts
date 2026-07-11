import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsUUID()
  @IsNotEmpty()
  empresaId!: string;
}
