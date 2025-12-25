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





// Добавим вспомогательные функции в начало api.js, после импортов

/**
 * Проверяет, находится ли текущее время между start и end
 */
function isNowBetween(startDateStr, endDateStr) {
  try {
    const now = new Date();
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    
    // Добавляем небольшую буферную зону (1 минута) для начала тренировки
    const bufferStart = new Date(start.getTime() - 60000); // 1 минута до начала
    const bufferEnd = new Date(end.getTime() + 60000); // 1 минута после окончания
    
    return now >= bufferStart && now <= bufferEnd;
  } catch (error) {
    console.error('Ошибка в isNowBetween:', error);
    return false;
  }
}

/**
 * Проверяет, находится ли тренировка в будущем
 */
function filterTrainingsByTime(trainings) {
  const now = new Date();
  console.log(`⏰ Текущее время: ${now.toLocaleString()}`);
  
  // 1. Текущие тренировки (идёт прямо сейчас)
  const currentTrainings = trainings.filter(t => isNowBetween(t.StartDate, t.EndDate));
  
  if (currentTrainings.length > 0) {
    console.log(`✅ Найдено ${currentTrainings.length} текущих тренировок`);
    return {
      current: currentTrainings[0],
      next: null,
      allCurrent: currentTrainings
    };
  }
  
  // 2. Будущие тренировки (начнутся в ближайшие 24 часа)
  const futureTrainings = trainings
    .filter(t => {
      const start = new Date(t.StartDate);
      return start > now && (start - now) < 24 * 60 * 60 * 1000;
    })
    .sort((a, b) => new Date(a.StartDate) - new Date(b.StartDate));
  
  if (futureTrainings.length > 0) {
    const nextTraining = futureTrainings[0];
    console.log(`⏭️ СЛЕДУЮЩАЯ тренировка: "${nextTraining.Service?.Title}" в ${nextTraining.StartDate}`);
    
    console.log('📅 Все будущие тренировки:');
    futureTrainings.forEach((t, i) => {
      const timeUntil = Math.round((new Date(t.StartDate) - now) / 60000);
      console.log(`  ${i+1}. ${t.Service?.Title} в ${t.StartDate} (через ${timeUntil} мин)`);
    });
    
    return {
      current: null,
      next: nextTraining,
      allFuture: futureTrainings
    };
  }
  
  console.log('📭 Нет текущих и будущих тренировок');
  return {
    current: null,
    next: null,
    allCurrent: [],
    allFuture: []
  };
}





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
      // response.data.data.slice(0, 5).forEach((item, index) => {
      response.data.data.forEach((item, index) => {
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
    
    // 8. ФИЛЬТРАЦИЯ GYM ZONE
    console.log('🎯 ФИЛЬТРУЮ ДАННЫЕ ДЛЯ GYM ZONE...');
    const allData = response.data?.data || [];
    console.log(`- Всего элементов в ответе: ${allData.length}`);
    
    const gymZoneTrainings = allData.filter(item => {
      const roomId = item.Room?.Id;
      const roomTitle = item.Room?.Title;
      // const isHitZone = roomId === '8b550c93-cf91-11f0-92a9-005056015d0b' || 
      //                  roomTitle === 'GYM ZONE';
      // const isHitZone = roomId === '8b550c93-cf91-11f0-92a9-005056015d0b' || 
      //                  roomTitle === 'GYM ZONE';

      // 1. Сначала ищем по ID из конфига
      if (roomId === tvConfig.room_id) {
        console.log(`  ✅ Найден по конфигу ID: "${roomTitle}" (${roomId})`);
        return true;
      }
      
      // 2. Если не нашли по ID, ищем по названию
      if (roomTitle === 'GYM ZONE') {
        console.log(`  ✅ Найден GYM ZONE по названию (ID: ${roomId})`);
        return true;
      }
      
      // if (isHitZone) {
      //   console.log(`  ✅ Найден GYM ZONE: "${roomTitle}" (ID: ${roomId})`);
      // }
      
      // return isHitZone;
      return false;
    });

    // Добавь в api.js после фильтрации:
    console.log('🔍 ДЕТАЛЬНО О ТРЕНИРОВКАХ:');
    gymZoneTrainings.forEach((t, i) => {
      console.log(`${i}. ${t.Service?.Title}`, {
        время: t.StartDate,
        статус: isNowBetween(t.StartDate, t.EndDate) ? 'ТЕКУЩАЯ' : 'НЕ ТЕКУЩАЯ',
        схема: t.Scheme?.length || 0,
        clients: t.Clients?.length || 0
      });
    });
    
    // console.log(`🎯 РЕЗУЛЬТАТ ФИЛЬТРАЦИИ: ${hitZoneTrainings.length} тренировок в HIT ZONE`);

    // === НОВЫЙ КОД: ФИЛЬТРАЦИЯ ПО ВРЕМЕНИ ===
    console.log('⏰ ФИЛЬТРУЮ ТРЕНИРОВКИ ПО ВРЕМЕНИ...');
    
    // Фильтруем по времени
    const timeFiltered = filterTrainingsByTime(gymZoneTrainings);
    
    // Выводим информацию о найденных тренировках
    if (timeFiltered.current) {
      console.log(`🎯 ВЫБРАНА ТЕКУЩАЯ тренировка: "${timeFiltered.current.Service?.Title}"`);
      console.log(`   Время: ${timeFiltered.current.StartDate} - ${timeFiltered.current.EndDate}`);
    } else if (timeFiltered.next) {
      const timeUntil = Math.round((new Date(timeFiltered.next.StartDate) - new Date()) / 60000);
      console.log(`⏭️ ВЫБРАНА СЛЕДУЮЩАЯ тренировка: "${timeFiltered.next.Service?.Title}"`);
      console.log(`   Начнется через ${timeUntil} минут (в ${timeFiltered.next.StartDate})`);
    } else {
      console.log('📭 НЕТ АКТУАЛЬНЫХ ТРЕНИРОВОК ПО ВРЕМЕНИ');
    }

    // Если нет тренировок в HIT ZONE
    if (gymZoneTrainings.length === 0) {
      console.log('❌ НЕТ ТРЕНИРОВОК В GYM ZONE!');
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
        allgymZoneTrainings: [],
        config: tvConfig
      };
    }
    
    // 9. ЛОГ НАЙДЕННЫХ GYM ZONE ТРЕНИРОВОК
    console.log('🏋️ ВСЕ GYM ZONE ТРЕНИРОВКИ НА СЕГОДНЯ:');
    gymZoneTrainings.forEach((training, index) => {
      const isCurrent = timeFiltered.current?.AppointmentID === training.AppointmentID;
      const isNext = timeFiltered.next?.AppointmentID === training.AppointmentID;
      const status = isCurrent ? 'ТЕКУЩАЯ' : isNext ? 'СЛЕДУЮЩАЯ' : 'неактивная';
      
      console.log(`  [${index}] [${status}]`, {
        title: training.Service?.Title,
        time: training.StartDate,
        duration: `${training.Duration} мин`,
        hasScheme: !!training.Scheme,
        // capacity: `${training.Clients?.length || 0}/${training.Capacity}`
        capacity: `${training.Capacity - training.AvailableSlots}/${training.Capacity}`
      });
    });
    
    // 10. ВЫБОР ОСНОВНОЙ ТРЕНИРОВКИ (ОБНОВЛЯЕМ!)
    console.log('👑 ВЫБИРАЮ ОСНОВНУЮ ТРЕНИРОВКУ ДЛЯ ОТОБРАЖЕНИЯ...');
    
    let mainTraining;
    if (timeFiltered.current) {
      mainTraining = timeFiltered.current;
      console.log('👑 Выбрана ТЕКУЩАЯ тренировка (активная сейчас)');
    } else if (timeFiltered.next) {
      mainTraining = timeFiltered.next;
      console.log('👑 Выбрана СЛЕДУЮЩАЯ тренировка (ближайшая в будущем)');
    } else if (gymZoneTrainings.length > 0) {
      // // Если нет актуальных по времени, берем первую вообще
      // mainTraining = gymZoneTrainings.find(item => item.Scheme) || gymZoneTrainings[0];
      // console.log('👑 Выбрана первая доступная тренировка (нет актуальных по времени)');
      mainTraining = null
    } else {
      mainTraining = null;
      console.log('👑 Нет тренировок для отображения');
    }

    if (mainTraining) {
      console.log('👑 Выбрана тренировка:', {
        title: mainTraining.Service?.Title,
        time: mainTraining.StartDate,
        hasScheme: !!mainTraining.Scheme,
        status: timeFiltered.current ? 'ТЕКУЩАЯ' : timeFiltered.next ? 'СЛЕДУЮЩАЯ' : 'ПРОСТО ДОСТУПНАЯ'
      });
    }
    
    // 11. ПОДГОТОВКА РЕЗУЛЬТАТА
    const result = {
      success: true,
      data: mainTraining,
      allgymZoneTrainings: gymZoneTrainings,
      config: tvConfig,
      allData: allData,
      // НОВЫЕ ПОЛЯ:
      timeFiltered: {
        current: timeFiltered.current,
        next: timeFiltered.next,
        allCurrent: timeFiltered.allCurrent || [],
        allFuture: timeFiltered.allFuture || []
      },
      // Статус для UI
      status: mainTraining ? 
        (timeFiltered.current ? 'current' : timeFiltered.next ? 'next' : 'available') : 
        'no_trainings'
    };
    
    console.log('📤 ПОДГОТОВЛЕН РЕЗУЛЬТАТ ДЛЯ ВОЗВРАТА:');
    console.log('- success:', result.success);
    console.log('- data.title:', result.data?.Service?.Title);
    console.log('- status:', result.status);
    console.log('- current тренировка:', !!result.timeFiltered.current);
    console.log('- next тренировка:', !!result.timeFiltered.next);
    console.log('- allgymZoneTrainings.length:', result.allgymZoneTrainings.length);
    
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
      allgymZoneTrainings: [],
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
      // name: training.Service?.Title || 'HIT ZONE',
      name: training.Service?.Title || 'GYM ZONE',
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