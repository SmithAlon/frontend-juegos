import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './lib/auth/AuthContext';

const Registro = lazy(() => import("./pages/Registro"));
const Inicio = lazy(() => import("./pages/Inicio"));
const TicTacToe = lazy(() => import("./components/tic-tac-toe"));
const MayorMenor = lazy(() => import("./components/MayorMenor"));
const InicioSesion = lazy(() => import("./pages/InicioSesion"));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Cargando...</div>}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<InicioSesion />} />
            <Route path="/registro" element={<Registro />} />

            {/* Rutas protegidas */}
            <Route 
              path="/inicio" 
              element={
                <ProtectedRoute>
                  <Inicio />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tictactoe" 
              element={
                <ProtectedRoute>
                  <TicTacToe />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mayormenor" 
              element={
                <ProtectedRoute>
                  <MayorMenor />
                </ProtectedRoute>
              } 
            />

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;