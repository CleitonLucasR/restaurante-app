export interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
}

export interface UpdateEmpresaPayload {
  nome?: string;
  email?: string;
}

export interface UpdateSenhaPayload {
  senhaAtual: string;
  novaSenha: string;
}