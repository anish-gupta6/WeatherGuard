import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// We no longer need a request interceptor to attach the Authorization header
// because cookies are automatically sent with every request since
// we have `withCredentials: true` configured above.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      try {
        // The refresh token is automatically sent via cookies
        await api.post('/auth/refresh');
        
        // The new access token is automatically set as a cookie by the backend response.
        // We can just retry the original request and the browser will include the new cookie.
        return api(originalRequest);
      } catch (refreshError) {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
