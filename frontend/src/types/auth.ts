export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: 'ADMIN' | 'GARCOM';
}

export interface AuthResponse {
  accessToken: string;
  usuario: Usuario;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  nomeEmpresa: string;
  cnpj: string;
  emailEmpresa: string;
  nomeUsuario: string;
  emailUsuario: string;
  senha: string;
}