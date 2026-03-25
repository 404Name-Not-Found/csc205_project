import axios from 'axios';

// Instace of axios
// https://axios-http.com/docs/instance
const apiClient = axios.create({
  baseURL: 'https://checksheets.cscprof.com',
  headers: {
    'Content-Type': 'application/json'
  }
});


// Add a request interceptor to add the token
// https://axios-http.com/docs/interceptors
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token');
    if (token) {
      config.headers['x-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
