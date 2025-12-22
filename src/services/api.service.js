// src/services/api.service.js
import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers
});

// Интерцептор для логирования (только в development)
if (API_CONFIG.development.logRequests) {
  api.interceptors.request.use(
    (config) => {
      console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('📤 API Request Error:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log(`📥 API Response: ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error('📥 API Response Error:', error.message);
      return Promise.reject(error);
    }
  );
}

// Основные методы API
export const apiService = {
  // ========== САЙТ ЭНДПОИНТЫ ==========
  
  // Получить список залов/клубов
  getGyms: async () => {
    try {
      const response = await api.get(API_CONFIG.endpoints.site.gyms);
      return response.data;
    } catch (error) {
      console.error('Error fetching gyms:', error);
      throw error;
    }
  },
  
  // Получить телевизоры/экраны для зала
  getTelevisors: async (gymId) => {
    try {
      const response = await api.get(API_CONFIG.endpoints.site.televisors, {
        params: { gym_id: gymId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching televisors:', error);
      throw error;
    }
  },
  
  // Получить тренировки для телевизора
  getTrainings: async (gymId, televisorId) => {
    try {
      const response = await api.get(API_CONFIG.endpoints.site.trainings, {
        params: { 
          gym_id: gymId,
          televisor_id: televisorId 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trainings:', error);
      throw error;
    }
  },
  
  // Получить комнаты
  getRooms: async () => {
    try {
      const response = await api.get(API_CONFIG.endpoints.site.rooms);
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },
  
  // Получить новости для зала
  getNews: async (gymId) => {
    try {
      const response = await api.get(API_CONFIG.endpoints.site.news, {
        params: { gym_id: gymId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },
  
  // ========== УНИВЕРСАЛЬНЫЕ МЕТОДЫ ==========
  
  // GET запрос
  get: async (endpoint, params = {}) => {
    try {
      const response = await api.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error(`GET Error for ${endpoint}:`, error);
      throw error;
    }
  },
  
  // POST запрос
  post: async (endpoint, data = {}) => {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`POST Error for ${endpoint}:`, error);
      throw error;
    }
  },
  
  // PUT запрос
  put: async (endpoint, data = {}) => {
    try {
      const response = await api.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`PUT Error for ${endpoint}:`, error);
      throw error;
    }
  },
  
  // DELETE запрос
  delete: async (endpoint) => {
    try {
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error(`DELETE Error for ${endpoint}:`, error);
      throw error;
    }
  }
};

export default apiService;