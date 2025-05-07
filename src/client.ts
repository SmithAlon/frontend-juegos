import axios from 'axios';

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
      console.error('Error del servidor:', error.response.data);
    }
    return Promise.reject(error);
  }
);