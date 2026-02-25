import axios from 'axios';

const api = axios.create({
  baseURL: '/api', 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized (user not logged in)
    if (error.response?.status === 401) {
      // Redirect to login or clear user state
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export default api;