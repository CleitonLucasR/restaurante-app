import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, Min, IsBoolean, IsInt } from "class-validator";

export class CreateProdutoDto {
    @IsString()
    @IsNotEmpty()
    nome!: string;

    @IsString()
    @IsOptional()
    descricao!: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    preco!: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    quantidadeEstoque!: number;

    @IsBoolean()
    @IsOptional()
    ativo?: boolean;

    @IsUUID()
    empresaId!: string;

    @IsUUID()
    categoriaId!: string;
}
