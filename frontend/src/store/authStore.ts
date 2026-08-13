import { create } from 'zustand';
import type { Usuario } from '../types/auth';

interface AuthState {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  setAuth: (usuario: Usuario, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: JSON.parse(localStorage.getItem('usuario') ?? 'null'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  setAuth: (usuario, token) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    set({ usuario, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('usuario');
    set({ usuario: null, isAuthenticated: false });
  },
}));