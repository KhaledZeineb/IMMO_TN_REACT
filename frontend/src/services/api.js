import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.onLogout = null;

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.log('Unauthorized access - 401 error');
          // Call logout callback if set
          if (this.onLogout) {
            this.onLogout();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setLogoutCallback(callback) {
    this.onLogout = callback;
  }

  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Auth token set successfully');
    } else {
      delete this.api.defaults.headers.common['Authorization'];
      console.log('Auth token removed');
    }
  }

  // Generic methods
  get(url, config = {}) {
    return this.api.get(url, config);
  }

  post(url, data, config = {}) {
    return this.api.post(url, data, config);
  }

  put(url, data, config = {}) {
    return this.api.put(url, data, config);
  }

  delete(url, config = {}) {
    return this.api.delete(url, config);
  }

  // File upload
  uploadFile(url, formData) {
    return this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default new ApiService();
