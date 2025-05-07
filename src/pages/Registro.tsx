import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { apiClient } from '../client';
import { useNavigate } from 'react-router-dom';

interface UserData {
  username: string;
  email: string;
  password: string;
}

function Registro() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isServerAvailable, setIsServerAvailable] = useState(true);
  const navigate = useNavigate();

  // Verificar la conexión con el servidor
  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        const response = await apiClient.get('/usuarios');
        console.log('Conexión exitosa:', response.status);
        setIsServerAvailable(true);
      } catch (err: any) {
        console.error('Error al verificar conexión con el servidor:', err);
        if (err.response) {
          console.error('Detalles del error:', err.response.data);
        }
        setIsServerAvailable(false);
      }
    };

    checkServerConnection();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!isServerAvailable) {
      setError('El servidor no está disponible. Por favor, verifica que el servidor esté corriendo en http://localhost:5000');
      setIsLoading(false);
      return;
    }

    try {
      // Validación básica
      if (!formData.username || !formData.email || !formData.password) {
        throw new Error('Todos los campos son requeridos');
      }

      if (formData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      if (formData.username.length < 3) {
        throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
      }

      // Validación de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Por favor, ingresa un email válido');
      }

      console.log('Enviando datos:', formData);
      const response = await apiClient.post('/usuarios', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Respuesta del servidor:', response);
      
      if (response.status === 201) {
        setSuccess('Usuario registrado exitosamente');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Error completo:', err);
      
      if (err.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error('Detalles del error del servidor:', err.response.data);
        setError(err.response.data?.message || 'Error en el servidor. Por favor, intenta nuevamente.');
      } else if (err.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        setError('No se recibió respuesta del servidor. Verifica que el servidor esté corriendo.');
        setIsServerAvailable(false);
      } else {
        // Algo sucedió al configurar la solicitud
        setError(err.message || 'Error al registrar usuario');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isServerAvailable) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold mb-4">Servidor no disponible</h2>
        <p className="text-red-500 mb-4">No se pudo conectar con el servidor en http://localhost:5000</p>
        <p className="text-sm text-gray-500 mb-4">Asegúrate de que:</p>
        <ul className="text-sm text-gray-500 list-disc mb-4">
          <li>El servidor Flask esté corriendo</li>
          <li>El puerto 5000 esté disponible</li>
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <div className="flex flex-col">
          <label htmlFor="username" className="mb-1">Crea tu nickname</label>
          <input 
            type="text" 
            id="username" 
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border-2 border-gray-300 rounded-sm bg-transparent p-1 font-light" 
            required
            disabled={isLoading}
            minLength={3}
            placeholder="Mínimo 3 caracteres"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border-2 border-gray-300 rounded-sm bg-transparent p-1 font-light" 
            required
            disabled={isLoading}
            placeholder="ejemplo@correo.com"
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
              onChange={handleChange}
              className="border-2 border-gray-300 rounded-sm bg-transparent p-1 font-light w-full"
              required
              disabled={isLoading}
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
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
        <p className="text-sm text-gray-500">¿Ya tienes cuenta? <a href="/login" className="text-[#F8F9FA]">Inicia sesión</a></p>
      </form>
    </section>
  )
}

export default Registro;