import { IsString, MinLength, Matches } from 'class-validator';

export class UpdateSenhaDto {
  @IsString()
  senhaAtual!: string;

  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[a-z])/, { message: 'A nova senha deve conter ao menos uma letra minúscula' })
  @Matches(/(?=.*[A-Z])/, { message: 'A nova senha deve conter ao menos uma letra maiúscula' })
  @Matches(/(?=.*\d)/, { message: 'A nova senha deve conter ao menos um número' })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, { message: 'A nova senha deve conter ao menos um caractere especial' })
  novaSenha!: string;
}