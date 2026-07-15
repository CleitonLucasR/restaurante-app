import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Prisma } from '@prisma/client';
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { nomeEmpresa, cnpj, emailEmpresa, nomeUsuario, emailUsuario, senha } = registerDto;

        const empresaExistente = await this.prisma.empresa.findFirst({
            where: { OR: [{ cnpj }, { email: emailEmpresa }] },
        });

        if (empresaExistente) {
            throw new ConflictException('Empresa com esse CNPJ ou e-mail já existe');
        }

        const usuarioExistente = await this.prisma.usuario.findFirst({
            where: { email: emailUsuario },
        });

        if (usuarioExistente) {
            throw new ConflictException('Usuário com esse e-mail já existe');
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        const resultado = await this.prisma.$transaction(async (tx) => {
            const empresa = await tx.empresa.create({
                data: {
                    nome: nomeEmpresa,
                    cnpj,
                    email: emailEmpresa
                }
            });

            const usuario = await tx.usuario.create({
                data: {
                    nome: nomeUsuario,
                    email: emailUsuario,
                    senhaHash,
                    papel: 'ADMIN',
                    empresaId: empresa.id
                }
            });

            return { empresa, usuario }
        });

        return this.gerarResposta(resultado.usuario, resultado.empresa.id)
    }

    async login(LoginDto: LoginDto) {
        const { email, senha } = LoginDto;

        const usuario = await this.prisma.usuario.findUnique({
            where: { email },
        });

        if (!usuario) {
            throw new UnauthorizedException('E-mail ou senha inválidos');
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);

        if (!senhaValida) {
            throw new UnauthorizedException('E-mail ou senha inválidos');
        }

        return this.gerarResposta(usuario, usuario.empresaId);
    }

    private gerarResposta(usuario: { id: string, nome: string, email: string, papel: string }, empresaId: string) {
        const payload = {
            sub: usuario.id,
            empresaId,
            papel: usuario.papel
        };

        return {
            accessToken: this.jwtService.sign(payload),
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                papel: usuario.papel
            }
        }
    }
}
