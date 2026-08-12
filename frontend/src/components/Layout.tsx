import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

export function Layout() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between border-b border-warm-dark/20 bg-white px-6 py-4">
        <h1 className="font-display text-xl font-semibold text-charcoal">
          Restaurante App
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-charcoal/70">Olá, {usuario?.nome}</span>
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}