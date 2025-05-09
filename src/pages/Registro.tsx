import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { apiClient } from '../client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth/AuthContext';

interface UserData {
  username: string;
  email: string;
  phone: string;
  password: string;
}

interface UserResponse {
  username: string;
  email: string;
}

function Registro() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    username: '',
    email: '',
    password: '',
    phone: ''
  });
  const [status, setStatus] = useState<{ type: 'error' | 'success' | null; message: string }>({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isServerAvailable, setIsServerAvailable] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

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

  const validateForm = (): string | null => {
    if (!formData.username || !formData.email || !formData.password) {
      return 'Todos los campos son requeridos';
    }
    if (formData.password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (formData.username.length < 3) {
      return 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Por favor, ingresa un email válido';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });
    setIsLoading(true);

    if (!isServerAvailable) {
      setStatus({ 
        type: 'error', 
        message: 'El servidor no está disponible. Por favor, verifica que el servidor esté corriendo en http://localhost:8000' 
      });
      setIsLoading(false);
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setStatus({ type: 'error', message: validationError });
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post<UserResponse>('/usuarios', formData);
      
      if (response.status === 201) {
        setStatus({ type: 'success', message: 'Usuario registrado exitosamente' });
        login(response.data);
        setTimeout(() => navigate('/inicio'), 2000);
      }
    } catch (err: any) {
      let errorMessage = 'Error al registrar usuario';
      if (err.response?.status === 400) {
        errorMessage = err.response.data.detail || 'El nombre de usuario ya está registrado';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'No se pudo conectar con el servidor';
        setIsServerAvailable(false);
      }
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isServerAvailable) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold mb-4">Servidor no disponible</h2>
        <p className="text-red-500 mb-4">No se pudo conectar con el servidor en http://localhost:8000</p>
        <p className="text-sm text-gray-500 mb-4">Asegúrate de que:</p>
        <ul className="text-sm text-gray-500 list-disc mb-4">
          <li>El servidor FastAPI esté corriendo</li>
          <li>MongoDB esté corriendo en el puerto 27017</li>
          <li>El puerto 8000 esté disponible</li>
          <li>CORS esté configurado correctamente en el servidor</li>
        </ul>
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
        <h1 className="text-xl font-semibold">Registro</h1>
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
          <label htmlFor="email" className="mb-1">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="border-2 border-gray-300 rounded-sm bg-transparent p-1 font-light" 
            required
            disabled={isLoading}
          />
        </div>
          <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="border-2 border-gray-300 rounded-sm bg-transparent p-1 font-light" 
            required
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
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
        <p className="text-sm text-gray-500">¿Ya tienes cuenta? <a href="/" className="text-[#F8F9FA]">Inicia sesión</a></p>
      </form>
    </section>
  );
}

export default Registro;