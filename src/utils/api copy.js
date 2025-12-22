// src/utils/api.js
import axios from 'axios';
import { getTVConfig } from '../config/tv-config';

// Базовый URL API
const BASE_API_URL = 'https://109.233.108.14/api';

// API ключ
const API_KEY = 'I3d54a0P1dT1XmHQlBL7Md2Qtp5EZgxuZ4a6eb8SRH446V9chelZCbQB9I89Xctt';

/**
 * Создаёт экземпляр axios с общими настройками
 */
const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
  headers: {
    'X-API-KEY': API_KEY,
    'Content-Type': 'application/json'
  }
});

/**
 * Получает расписание для текущего телевизора
 */
export async function fetchTrainings() {
  try {
    // Получаем конфигурацию телевизора
    const tvConfig = getTVConfig();
    
    // ВАЖНО: Проверяем, какой метод нужен! 
    // По умолчанию GET с query параметрами
    
    // Вариант 1: GET с параметрами в URL (скорее всего это)
    const response = await api.get('/site/trainings', {
      params: {
        gym_id: tvConfig.gym_id,
        televisor_id: tvConfig.televisor_id,
        RoomID: tvConfig.room_id
      },
      headers: {
        'clubId': tvConfig.gym_id.toString()
      }
    });
    
    // ИЛИ Вариант 2: POST с телом (если GET не работает)
    // const response = await api.post('/site/trainings', {
    //   gym_id: tvConfig.gym_id,
    //   televisor_id: tvConfig.televisor_id,
    //   RoomID: tvConfig.room_id
    // }, {
    //   headers: {
    //     'clubId': tvConfig.gym_id.toString()
    //   }
    // });
    
    console.log('API Response (trainings):', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Ошибка при загрузке расписания:', error);
    
    // Возвращаем пустые данные для демо
    return {
      data: [],
      status: 'error',
      error: error.message
    };
  }
}

/**
 * Получает текущую конфигурацию телевизора
 */
// export function getCurrentTVConfig() {
//   return getTVConfig();
// }

export function getCurrentTVConfig() {
  // Добавляем флаг, чтобы предотвратить редирект при вызове из SmartLayoutRouter
  const config = getTVConfig();
  
  // Убираем автоматический редирект из этой функции
  // Перенесли его в tv-config.js с условиями
  
  return config;
}

/**
 * Проверяет, настроен ли телевизор
 */
export function isTVConfigured() {
  const gymId = localStorage.getItem('gym_id');
  const roomId = localStorage.getItem('room_id');
  const televisorId = localStorage.getItem('televisor_id');
  
  return !!(gymId && roomId && televisorId);
}

export default api;