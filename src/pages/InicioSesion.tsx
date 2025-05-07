import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { apiClient } from '../client';
import { useNavigate } from 'react-router-dom';

interface LoginData {
  username: string;
  password: string;
}

interface UserResponse {
  username: string;
  email: string;
}

function InicioSesion() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: ''
  });
  const [status, setStatus] = useState<{ type: 'error' | 'success' | null; message: string }>({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isServerAvailable, setIsServerAvailable] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        await apiClient.get('/usuarios');
        setIsServerAvailable(true);
      } catch {
        setIsServerAvailable(false);
      }
    };
    checkServerConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });
    setIsLoading(true);

    if (!isServerAvailable) {
      setStatus({ 
        type: 'error', 
        message: 'El servidor no está disponible' 
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post<UserResponse>('/login', formData);
      
      if (response.status === 200) {
        setStatus({ type: 'success', message: 'Inicio de sesión exitoso' });
        localStorage.setItem('user', JSON.stringify(response.data));
        setTimeout(() => navigate('/inicio'), 2000);
      }
    } catch (err: any) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.detail || 'Error al iniciar sesión' 
      });
      if (err.code === 'ERR_NETWORK') setIsServerAvailable(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isServerAvailable) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold mb-4">Servidor no disponible</h2>
        <p className="text-red-500 mb-4">No se pudo conectar con el servidor</p>
        <button 
          onClick={() => window.location.reload()} 
          className="border-2 bg-[#F8F9FA] p-2 text-[#181616] text-sm rounded"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  return (
    <section className="flex flex-row justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center justify-center h-screen">
        <h1 className="text-xl font-semibold">Iniciar Sesión</h1>
        {status.type && (
          <p className={`text-${status.type === 'error' ? 'red' : 'green'}-500 text-sm`}>
            {status.message}
          </p>
        )}
        <div className="flex flex-col">
          <label htmlFor="username" className="mb-1">Nickname</label>
          <input 
            type="text" 
            id="username" 
            name="username"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            className="border-2 border-gray-300 rounded-sm bg-transparent p-1 font-light" 
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="border-2 border-gray-300 rounded-sm bg-transparent p-1 font-light w-full"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              disabled={isLoading}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <button 
          type="submit" 
          className='border-2 bg-[#F8F9FA] p-1 text-[#181616] text-sm'
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
        <p className="text-sm text-gray-500">¿No tienes cuenta? <a href="/registro" className="text-[#F8F9FA]">Regístrate</a></p>
      </form>
    </section>
  );
}

export default InicioSesion;