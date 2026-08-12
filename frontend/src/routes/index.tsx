import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '@/pages/AuthPage';
import { HomePage } from '@/pages/HomePage';
import { ComandaPage } from '@/pages/ComandaPage';
import { Layout } from '@/components/Layout';
import { useAuthStore } from '@/store/authStore';
import { CategoriasPage } from '@/pages/CategoriasPage';
import { ProdutosPage } from '@/pages/ProdutosPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/comandas/:id" element={<ComandaPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}