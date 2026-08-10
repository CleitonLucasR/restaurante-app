import { IsDateString } from 'class-validator';

export class PeriodoRelatorioDto {
  @IsDateString()
  inicio!: string;

  @IsDateString()
  fim!: string;
}