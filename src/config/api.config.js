// src/config/api.config.js
export const API_CONFIG = {
  // baseURL: 'https://109.233.108.14/api',
  baseURL: 'https://test.rebootstudio.kz/api',
  apiKey: 'I3d54a0P1dT1XmHQlBL7Md2Qtp5EZgxuZ4a6eb8SRH446V9chelZCbQB9I89Xctt',
  
  endpoints: {
    // Эндпоинты сайта (для экранов тренировок)
    site: {
      trainings: '/site/trainings',
      televisors: '/site/televisors',
      rooms: '/site/rooms',
      gyms: '/site/gyms',
      news: '/site/news'
    },
    
    // Эндпоинты для данных тренировок
    training: {
      current: '/trainings/current',
      schedule: '/trainings/schedule',
      clients: '/trainings/clients',
      rounds: '/trainings/rounds'
    },
    
    // Эндпоинты для клиентов
    client: {
      profile: '/client/profile',
      progress: '/client/progress'
    }
  },
  
  // Заголовки по умолчанию
//   headers: {
//     'X-API-KEY': 'I3d54a0P1dT1XmHQlBL7Md2Qtp5EZgxuZ4a6eb8SRH446V9chelZCbQB9I89Xctt',
//     'Content-Type': 'application/json'
//   },
  
  headers: {
  'X-API-KEY': 'I3d54a0P1dT1XmHQlBL7Md2Qtp5EZgxuZ4a6eb8SRH446V9chelZCbQB9I89Xctt',
  'clubId': '1', // <-- ТОЧНО ТАК! camelCase
  'Content-Type': 'application/json'
    },

  // Таймауты
  timeout: 10000,
  
  // Настройки для разработки
  development: {
    useMockData: false, // Использовать мок-данные при отключенном бекенде
    logRequests: true  // Логировать запросы
  }
};

export default API_CONFIG;