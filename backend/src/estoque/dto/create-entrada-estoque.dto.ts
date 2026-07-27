import { IsInt, Min, IsString, IsOptional } from 'class-validator';

export class CreateEntradaEstoqueDto {
  @IsInt()
  @Min(1)
  quantidade!: number;

  @IsString()
  @IsOptional()
  motivo?: string;
}