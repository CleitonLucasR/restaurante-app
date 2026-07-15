import { IsString, IsNotEmpty, IsEmail, MinLength, Matches } from 'class-validator';

export class RegisterDto {
    //Dados empresa
    @IsString()
    @IsNotEmpty()
    nomeEmpresa!: string;

    @IsEmail()
    emailEmpresa!: string;

    @IsString()
    @IsNotEmpty()
    cnpj!: string;

    //Dados usuario admin
    @IsString()
    @IsNotEmpty()
    nomeUsuario!: string;

    @IsEmail()
    emailUsuario!: string;

    @IsString()
    @MinLength(8)
    @Matches(/(?=.*[a-z])/, {
        message: 'A senha deve conter ao menos uma letra minúscula',
    })
    @Matches(/(?=.*[A-Z])/, {
        message: 'A senha deve conter ao menos uma letra maiúscula',
    })
    @Matches(/(?=.*\d)/, {
        message: 'A senha deve conter ao menos um número',
    })
    @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
        message: 'A senha deve conter ao menos um caractere especial',
    })
    senha!: string;
}