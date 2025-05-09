import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
apiClient.interceptors.response.use(
  response => {
    console.log('API Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    if (error.code === 'ERR_NETWORK') {
      console.error('Error de conexión: El servidor no está respondiendo');
    } else if (error.response) {
      console.error('Error del servidor:', error.response.data);
    }
    return Promise.reject(error);
  }
);