// src/utils/api.js - ПОЛНЫЙ с getCurrentTVConfig
import axios from 'axios';
import https from 'https'; 
import { getTVConfig } from '../config/tv-config';

// const BASE_API_URL = 'https://109.233.108.14/api';
const BASE_API_URL = 'https://test.rebootstudio.kz/api';
const API_KEY = 'I3d54a0P1dT1XmHQlBL7Md2Qtp5EZgxuZ4a6eb8SRH446V9chelZCbQB9I89Xctt';

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 15000,
  headers: {
    'X-API-KEY': API_KEY,
    'clubId': '1',
    'Accept': 'application/json'
    // 'Content-Type': 'application/json'
  }
});

/**
 * Получает расписание для HIT ZONE (GET запрос с параметрами)
 */
// api.js - обновленный fetchTrainings()
// export async function fetchTrainings() {
//   try {
//     const tvConfig = getTVConfig();
    
//     console.log('Запрос к /site/trainings:', {
//       gym_id: tvConfig.gym_id,
//       televisor_id: tvConfig.televisor_id,
//       room_id: tvConfig.room_id
//     });
    
//     const response = await api.get('/site/trainings', {
//       params: {
//         gym_id: tvConfig.gym_id,
//         televisor_id: tvConfig.televisor_id,
//         room_id: tvConfig.room_id
//       }
//     });
    
//     console.log('Ответ от API:', response.data);
    
//     // Фильтруем ВСЕ тренировки в HIT ZONE
//     const hitZoneTrainings = response.data.data?.filter(item => 
//       item.Room?.Id === '8b550c93-cf91-11f0-92a9-005056015d0b' || // HIT ZONE ID
//       item.Room?.Title === 'HIT ZONE'
//     ) || [];
    
//     if (hitZoneTrainings.length === 0) {
//       console.log('Нет тренировок в HIT ZONE');
//       return {
//         success: false,
//         error: 'Нет тренировок в HIT ZONE',
//         data: null,
//         allHitZoneTrainings: [],
//         config: tvConfig
//       };
//     }
    
//     // Основная тренировка (первая с Scheme или первая в списке)
//     const mainTraining = hitZoneTrainings.find(item => item.Scheme) || hitZoneTrainings[0];
    
//     return {
//       success: true,
//       data: mainTraining,           // Основная тренировка для отображения
//       allHitZoneTrainings: hitZoneTrainings, // ВСЕ тренировки в HIT ZONE
//       config: tvConfig,
//       allData: response.data.data || []
//     };
    
//   } catch (error) {
//     console.error('Ошибка при загрузке:', error);
    
//     return {
//       success: false,
//       error: error.message,
//       data: null,
//       allHitZoneTrainings: [],
//       config: getTVConfig()
//     };
//   }
// }





export async function fetchTrainings() {
  try {
    const tvConfig = getTVConfig();
    
    // 1. ЛОГ КОНФИГУРАЦИИ
    console.log('🎬 =========== НАЧАЛО ЗАПРОСА fetchTrainings ===========');
    console.log('🔧 Конфигурация телевизора:', JSON.stringify(tvConfig, null, 2));
    console.log('🔧 Параметры запроса:', {
      gym_id: tvConfig.gym_id,
      televisor_id: tvConfig.televisor_id,
      room_id: tvConfig.room_id
    });
    
    // 2. ЛОГ ПОЛНОГО URL
    const fullUrl = `https://test.rebootstudio.kz/api/site/trainings?gym_id=${tvConfig.gym_id}&televisor_id=${tvConfig.televisor_id}&room_id=${tvConfig.room_id}`;
    console.log('🔗 Полный URL запроса:', fullUrl);
    
    // 3. ЛОГ ЗАГОЛОВКОВ
    console.log('📤 Отправляемые заголовки:', {
      'X-API-KEY': 'I3d54a0P1dT1XmHQlBL7Md2Qtp5EZgxuZ4a6eb8SRH446V9chelZCbQB9I89Xctt',
      'Accept': 'application/json',
      'clubId': '1'
    });
    
    // 4. ВЫПОЛНЕНИЕ ЗАПРОСА
    console.log('🚀 Отправляю GET запрос...');
    const response = await api.get('/site/trainings', {
      params: {
        gym_id: tvConfig.gym_id,
        televisor_id: tvConfig.televisor_id,
        room_id: tvConfig.room_id
      }
    });
    
    // 5. ЛОГ ОТВЕТА (БАЗОВЫЙ)
    console.log('✅ ЗАПРОС УСПЕШЕН!');
    console.log('📊 Статус ответа:', response.status, response.statusText);
    console.log('📊 Заголовки ответа:', JSON.stringify(response.headers, null, 2));
    
    // 6. ЛОГ СТРУКТУРЫ ДАННЫХ
    console.log('📦 СТРУКТУРА ОТВЕТА:');
    console.log('- Есть ли response.data?', !!response.data);
    if (response.data) {
      console.log('- Ключи в response.data:', Object.keys(response.data));
      console.log('- Есть ли response.data.data?', !!response.data.data);
      console.log('- Тип response.data.data:', typeof response.data.data);
      if (Array.isArray(response.data.data)) {
        console.log('- Длина массива data:', response.data.data.length);
      }
    }
    
    // 7. ЛОГ ВСЕХ ДАННЫХ (если есть)
    if (response.data?.data && Array.isArray(response.data.data)) {
      console.log('📋 ВСЕ ДАННЫЕ ОТ API (первые 5 элементов):');
      response.data.data.slice(0, 5).forEach((item, index) => {
        console.log(`  [${index}]`, {
          AppointmentID: item.AppointmentID?.substring(0, 20) + '...',
          Service: item.Service?.Title,
          Room: item.Room?.Title,
          StartDate: item.StartDate,
          hasScheme: !!item.Scheme,
          clientsCount: item.Clients?.length,
          Capacity: item.Capacity
        });
      });
      
      if (response.data.data.length > 5) {
        console.log(`  ... и еще ${response.data.data.length - 5} элементов`);
      }
    } else {
      console.log('⚠️ response.data.data не массив или отсутствует');
      console.log('response.data:', response.data);
    }
    
    // 8. ФИЛЬТРАЦИЯ HIT ZONE
    console.log('🎯 ФИЛЬТРУЮ ДАННЫЕ ДЛЯ HIT ZONE...');
    const allData = response.data?.data || [];
    console.log(`- Всего элементов в ответе: ${allData.length}`);
    
    const hitZoneTrainings = allData.filter(item => {
      const roomId = item.Room?.Id;
      const roomTitle = item.Room?.Title;
      const isHitZone = roomId === '8b550c93-cf91-11f0-92a9-005056015d0b' || 
                       roomTitle === 'HIT ZONE';
      
      if (isHitZone) {
        console.log(`  ✅ Найден HIT ZONE: "${roomTitle}" (ID: ${roomId})`);
      }
      
      return isHitZone;
    });
    
    console.log(`🎯 РЕЗУЛЬТАТ ФИЛЬТРАЦИИ: ${hitZoneTrainings.length} тренировок в HIT ZONE`);
    
    if (hitZoneTrainings.length === 0) {
      console.log('❌ НЕТ ТРЕНИРОВОК В HIT ZONE!');
      console.log('📋 Все комнаты в ответе:', 
        allData.map(item => item.Room?.Title).filter(Boolean).join(', ')
      );
      console.log('📋 Все ID комнат в ответе:', 
        allData.map(item => item.Room?.Id).filter(Boolean).join(', ')
      );
      
      return {
        success: false,
        error: 'Нет тренировок в HIT ZONE',
        data: null,
        allHitZoneTrainings: [],
        config: tvConfig
      };
    }
    
    // 9. ЛОГ НАЙДЕННЫХ HIT ZONE ТРЕНИРОВОК
    console.log('🏋️ НАЙДЕННЫЕ HIT ZONE ТРЕНИРОВКИ:');
    hitZoneTrainings.forEach((training, index) => {
      console.log(`  [${index}]`, {
        title: training.Service?.Title,
        trainer: training.Employee?.FullName,
        time: training.StartDate,
        hasScheme: !!training.Scheme,
        schemeLength: training.Scheme?.length,
        clients: training.Clients?.length || 0,
        capacity: training.Capacity,
        clientsList: training.Clients?.map(c => c.Name) || []
      });
    });
    
    // 10. ВЫБОР ОСНОВНОЙ ТРЕНИРОВКИ
    console.log('👑 ВЫБИРАЮ ОСНОВНУЮ ТРЕНИРОВКУ...');
    const mainTraining = hitZoneTrainings.find(item => item.Scheme) || hitZoneTrainings[0];
    console.log('👑 Выбрана тренировка:', {
      title: mainTraining.Service?.Title,
      hasScheme: !!mainTraining.Scheme,
      clientsCount: mainTraining.Clients?.length
    });
    
    // 11. ПОДГОТОВКА РЕЗУЛЬТАТА
    const result = {
      success: true,
      data: mainTraining,
      allHitZoneTrainings: hitZoneTrainings,
      config: tvConfig,
      allData: allData
    };
    
    console.log('📤 ПОДГОТОВЛЕН РЕЗУЛЬТАТ ДЛЯ ВОЗВРАТА:');
    console.log('- success:', result.success);
    console.log('- data.title:', result.data?.Service?.Title);
    console.log('- allHitZoneTrainings.length:', result.allHitZoneTrainings.length);
    console.log('- allData.length:', result.allData.length);
    
    console.log('🎬 =========== КОНЕЦ fetchTrainings ===========');
    
    return result;
    
  } catch (error) {
    console.error('❌❌❌ ОШИБКА В fetchTrainings ❌❌❌');
    console.error('Сообщение ошибки:', error.message);
    console.error('Код ошибки:', error.code);
    console.error('Статус ответа:', error.response?.status);
    console.error('Текст статуса:', error.response?.statusText);
    console.error('Данные ошибки:', error.response?.data);
    console.error('Конфиг запроса:', {
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers,
      params: error.config?.params
    });
    
    console.log('🎬 =========== КОНЕЦ fetchTrainings (С ОШИБКОЙ) ===========');
    
    return {
      success: false,
      error: error.message,
      data: null,
      allHitZoneTrainings: [],
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
      // name: training.Service?.Title || 'GYM ZONE',
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