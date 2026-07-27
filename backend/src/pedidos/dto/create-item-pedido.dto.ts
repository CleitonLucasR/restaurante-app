import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateItemPedidoDto {
  @IsUUID()
  produtoId!: string;

  @IsInt()
  @Min(1)
  quantidade!: number;
}