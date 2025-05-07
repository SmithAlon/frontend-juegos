import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from './components/ProtectRutas.tsx';

const Registro = lazy(() => import("./pages/Registro.tsx"));
const InicioSesion = lazy(() => import("./pages/InicioSesion.tsx"));
const Inicio = lazy(() => import("./pages/Inicio.tsx"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Cargando...</div>}>
        <Routes>
          <Route path="/" element={<InicioSesion />} />
          <Route path="/registro" element={<Registro />} />
          <Route 
            path="/inicio" 
            element={
              <ProtectedRoute>
                <Inicio />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;