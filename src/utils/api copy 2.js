// // src/utils/api.js - ОБНОВЛЕННЫЙ
// import axios from 'axios';
// import { getTVConfig } from '../config/tv-config';

// const BASE_API_URL = 'https://109.233.108.14/api';
// const API_KEY = 'I3d54a0P1dT1XmHQlBL7Md2Qtp5EZgxuZ4a6eb8SRH446V9chelZCbQB9I89Xctt';

// const api = axios.create({
//   baseURL: BASE_API_URL,
//   timeout: 10000,
//   headers: {
//     'X-API-KEY': API_KEY,
//     'Content-Type': 'application/json'
//   }
// });

// /**
//  * Получает расписание для HIT ZONE (GET запрос с параметрами)
//  */
// export async function fetchTrainings() {
//   try {
//     const tvConfig = getTVConfig();
    
//     console.log('Запрос к /site/trainings:', {
//       gym_id: tvConfig.gym_id,
//       televisor_id: tvConfig.televisor_id,
//       room_id: tvConfig.room_id
//     });
    
//     // GET запрос с query параметрами
//     const response = await api.get('/site/trainings', {
//       params: {
//         gym_id: tvConfig.gym_id,
//         televisor_id: tvConfig.televisor_id,
//         room_id: tvConfig.room_id
//       }
//     });
    
//     console.log('Ответ от API:', response.data);
    
//     // Ищем тренировку со Scheme (HIT ZONE)
//     const hitZoneTraining = response.data.data?.find(item => item.Scheme);
    
//     if (!hitZoneTraining) {
//       console.log('Нет тренировки со Scheme');
//       return {
//         success: false,
//         error: 'Нет данных для HIT ZONE',
//         data: null,
//         config: tvConfig
//       };
//     }
    
//     return {
//       success: true,
//       data: hitZoneTraining,
//       config: tvConfig,
//       allData: response.data.data || []
//     };
    
//   } catch (error) {
//     console.error('Ошибка при загрузке:', error);
    
//     return {
//       success: false,
//       error: error.message,
//       data: null,
//       config: getTVConfig()
//     };
//   }
// }

// /**
//  * Фильтрует данные Scheme для текущего телевизора
//  */
// export function filterSchemeForCurrentTV(schemeData, tvConfig) {
//   if (!schemeData || !Array.isArray(schemeData)) {
//     console.warn('Нет данных Scheme');
//     return [];
//   }
  
//   const stationIds = tvConfig.stationIds || [];
  
//   if (stationIds.length === 0) {
//     console.warn('Нет stationIds в конфиге');
//     return schemeData[0] || [];
//   }
  
//   // Берем первый раунд
//   const firstRound = schemeData[0] || [];
  
//   // Фильтруем только станции этого телевизора
//   const filteredRound = firstRound.filter(item => 
//     stationIds.includes(item.station_id)
//   );
  
//   console.log(`Фильтровано ${filteredRound.length} станций для TV ${tvConfig.televisor_id}`);
//   return filteredRound;
// }

// /**
//  * Универсальная функция для загрузки и обработки данных
//  */
// export async function getTrainingData() {
//   const result = await fetchTrainings();
  
//   if (!result.success || !result.data) {
//     return {
//       success: false,
//       error: result.error,
//       data: null
//     };
//   }
  
//   const training = result.data;
//   const config = result.config;
  
//   // Фильтруем Scheme
//   const filteredStations = filterSchemeForCurrentTV(training.Scheme, config);
  
//   // Форматируем данные
//   const formattedData = {
//     trainingInfo: {
//       name: training.Service?.Title || 'HIT ZONE',
//       time: training.StartDate,
//       trainer: training.Employee?.FullName,
//       round: 1,
//       totalRounds: training.Scheme?.length || 0
//     },
//     stations: {},
//     config: config
//   };
  
//   // Создаем объект станций
//   config.stationNumbers?.forEach(stationNumber => {
//     const stationData = filteredStations.find(s => s.station_number === stationNumber);
    
//     formattedData.stations[stationNumber] = {
//       clientName: stationData?.client_name || 'Свободно',
//       exerciseName: stationData?.training?.name || '',
//       videoUrl: stationData?.training?.video || '',
//       stationId: stationData?.station_id
//     };
//   });
  
//   return {
//     success: true,
//     data: formattedData
//   };
// }


// src/utils/api.js - ПОЛНЫЙ с getCurrentTVConfig
import axios from 'axios';
import https from 'https'; 
import { getTVConfig } from '../config/tv-config';

const BASE_API_URL = 'https://109.233.108.14/api';
const API_KEY = 'I3d54a0P1dT1XmHQlBL7Md2Qtp5EZgxuZ4a6eb8SRH446V9chelZCbQB9I89Xctt';

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 15000,
  headers: {
    'X-API-KEY': API_KEY,
    'Accept': 'application/json'
    // 'Content-Type': 'application/json'
  }
});

/**
 * Получает расписание для HIT ZONE (GET запрос с параметрами)
 */
export async function fetchTrainings() {
  try {
    const tvConfig = getTVConfig();
    
    console.log('Запрос к /site/trainings:', {
      gym_id: tvConfig.gym_id,
      televisor_id: tvConfig.televisor_id,
      room_id: tvConfig.room_id
    });
    
    // GET запрос с query параметрами
    const response = await api.get('/site/trainings', {
      params: {
        gym_id: tvConfig.gym_id,
        televisor_id: tvConfig.televisor_id,
        room_id: tvConfig.room_id,
        // clubId: '1' // ← В ПАРАМЕТРАХ!
      }
    });
    
    console.log('Ответ от API:', response.data);
    
    // Ищем тренировку со Scheme (HIT ZONE)
    const hitZoneTraining = response.data.data?.find(item => item.Scheme);
    
    if (!hitZoneTraining) {
      console.log('Нет тренировки со Scheme');
      return {
        success: false,
        error: 'Нет данных для HIT ZONE',
        data: null,
        config: tvConfig
      };
    }
    
    return {
      success: true,
      data: hitZoneTraining,
      config: tvConfig,
      allData: response.data.data || []
    };
    
  } catch (error) {
    console.error('Ошибка при загрузке:', error);
    
    return {
      success: false,
      error: error.message,
      data: null,
      config: getTVConfig()
    };
  }
}

/**
 * Фильтрует данные Scheme для текущего телевизора
 */
export function filterSchemeForCurrentTV(schemeData, tvConfig) {
  if (!schemeData || !Array.isArray(schemeData)) {
    console.warn('Нет данных Scheme');
    return [];
  }
  
  const stationIds = tvConfig.stationIds || [];
  
  if (stationIds.length === 0) {
    console.warn('Нет stationIds в конфиге');
    return schemeData[0] || [];
  }
  
  // Берем первый раунд
  const firstRound = schemeData[0] || [];
  
  // Фильтруем только станции этого телевизора
  const filteredRound = firstRound.filter(item => 
    stationIds.includes(item.station_id)
  );
  
  console.log(`Фильтровано ${filteredRound.length} станций для TV ${tvConfig.televisor_id}`);
  return filteredRound;
}

/**
 * Универсальная функция для загрузки и обработки данных
 */
export async function getTrainingData() {
  const result = await fetchTrainings();
  
  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error,
      data: null
    };
  }
  
  const training = result.data;
  const config = result.config;
  
  // Фильтруем Scheme
  const filteredStations = filterSchemeForCurrentTV(training.Scheme, config);
  
  // Форматируем данные
  const formattedData = {
    trainingInfo: {
      name: training.Service?.Title || 'HIT ZONE',
      time: training.StartDate,
      trainer: training.Employee?.FullName,
      round: 1,
      totalRounds: training.Scheme?.length || 0
    },
    stations: {},
    config: config
  };
  
  // Создаем объект станций
  config.stationNumbers?.forEach(stationNumber => {
    const stationData = filteredStations.find(s => s.station_number === stationNumber);
    
    formattedData.stations[stationNumber] = {
      clientName: stationData?.client_name || 'Свободно',
      exerciseName: stationData?.training?.name || '',
      videoUrl: stationData?.training?.video || '',
      stationId: stationData?.station_id
    };
  });
  
  return {
    success: true,
    data: formattedData
  };
}

/**
 * Получает текущую конфигурацию телевизора
 * (Алиас для getTVConfig для обратной совместимости)
 */
export function getCurrentTVConfig() {
  const tvConfig = getTVConfig();
  console.log('getCurrentTVConfig вызван:', tvConfig);
  return tvConfig;
}

/**
 * Проверяет, настроен ли телевизор (для обратной совместимости)
 */
export function isTVConfigured() {
  const config = getTVConfig();
  return !!(config.gym_id && config.room_id && config.televisor_id);
}

export default api;