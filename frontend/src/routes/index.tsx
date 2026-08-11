import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '../pages/AuthPage';
import { useAuthStore } from '../store/authStore';

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
          path="/"
          element={
            <PrivateRoute>
              <div className="p-8">
                <h1 className="font-display text-2xl">Home (em construção)</h1>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}