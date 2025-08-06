import axios from 'axios';

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`, 
  withCredentials: true, 
});


instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
       const res = await instance.get('/auth/refresh', { withCredentials: true }); 
        const newAccessToken = res.data.accessToken;
        localStorage.setItem('token', newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return instance(originalRequest); 
      } catch (err) {
        console.log("Refresh token failed", err);
        // localStorage.removeItem('token');
        // window.location.href = '/FacturaPro/login'; 
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
