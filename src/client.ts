import axios from 'axios';

// Configuración del cliente API
export const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Error de conexión: El servidor no está respondiendo');
    } else if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error del servidor:', error.response.data);
    }
    return Promise.reject(error);
  }
);