import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class UpdateEmpresaDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nome?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}