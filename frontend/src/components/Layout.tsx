import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

const links = [
  { to: '/', label: 'Mesas' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/produtos', label: 'Produtos' },
  { to: '/estoque', label: 'Estoque' },
  { to: '/relatorios', label: 'Relatórios' },
];

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useAuthStore();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between border-b border-warm-dark/20 bg-white px-6 py-4">
        <div className="flex items-center gap-6">
          <h1 className="font-display text-xl font-semibold text-charcoal">
            Restaurante App
          </h1>
          <nav className="flex gap-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium ${
                  location.pathname === link.to
                    ? 'text-primary'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
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