// training-data.js - полная версия с логикой выбора layout
import { fetchTrainings } from './api';

// const TEST_MODE = true; 
const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5174/api';

// Добавляем функции для кэширования
const CACHE_KEY = 'hit_zone_data_cache';
const CACHE_TIMESTAMP_KEY = 'hit_zone_data_timestamp';
const CACHE_DURATION = 15 * 60 * 1000; // 15 минут

export function cacheHitZoneData(data) {
    console.log('💾 [CACHE] cacheHitZoneData вызвана');
    console.log('   Получены данные:', {
        success: data?.success,
        hasScheme: !!data?.Scheme,
        status: data?.status,
        schemeLength: data?.Scheme?.length
    });
    
//   try {
//     const cacheData = {
//       data: data,
//       timestamp: Date.now()
//     };
//     localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
//     console.log('✅ Данные сохранены в кэш');
//   } catch (error) {
//     console.warn('⚠️ Не удалось сохранить в кэш:', error);
//   }

  try {
    const cacheData = {
      data: {
        ...data,
        // Гарантируем, что у кэшированных данных есть статус
        status: data.status || 'available'
      },
      timestamp: Date.now(),
      version: 'v2' // Добавляем версию кэша
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log('✅ Данные сохранены в кэш, статус:', cacheData.data.status);
  } catch (error) {
    console.warn('⚠️ Не удалось сохранить в кэш:', error);
  }
}

// export function getCachedHitZoneData() {
//   try {
//     const cached = localStorage.getItem(CACHE_KEY);
//     if (!cached) return null;
    
//     const { data, timestamp } = JSON.parse(cached);
    
//     // Проверяем не устарели ли данные
//     if (Date.now() - timestamp > CACHE_DURATION) {
//       console.log('⚠️ Данные в кэше устарели');
//       localStorage.removeItem(CACHE_KEY);
//       return null;
//     }
    
//     console.log('✅ Использую данные из кэша');
//     return data;
//   } catch (error) {
//     console.warn('⚠️ Ошибка чтения кэша:', error);
//     return null;
//   }
// }


export function getCachedHitZoneData() {
  console.log('🔍 [GET CACHE] Поиск кэша в', CACHE_KEY);
  
  const cachedStr = localStorage.getItem(CACHE_KEY);
  console.log('   Найден ключ?', !!cachedStr);
  
  if (!cachedStr) {
    console.log('   ❌ Ключ не найден');
    console.log('   Все доступные ключи:', Object.keys(localStorage));
    return null;
  }
  
  console.log('   Размер данных:', cachedStr.length, 'байт');
  
//   try {
//     const { data, timestamp } = JSON.parse(cachedStr);
//     console.log('   ✅ Кэш распарсен успешно');
//     console.log('   Время создания:', new Date(timestamp).toLocaleTimeString());
//     console.log('   Данные:', {
//       success: data?.success,
//       layout: data?.layout
//     });
    
//     return data;
//   } catch (error) {
//     console.error('   ❌ Ошибка парсинга кэша:', error);
//     console.log('   Сырые данные (первые 200 символов):', cachedStr.substring(0, 200));
//     return null;
//   }

  try {
    const cacheData = JSON.parse(cachedStr);
    
    // Извлекаем данные (поддерживаем оба формата)
    let data = cacheData.data || cacheData;
    
    // ДОБАВЛЯЕМ СТАТУС ЕСЛИ ЕГО НЕТ
    if (!data.status) {
      console.log('⚠️ У кэшированных данных нет статуса, добавляем "available"');
      data.status = 'available';
    }
    
    console.log('✅ Кэш загружен, статус:', data.status);
    return data;
    
  } catch (error) {
    console.error('Ошибка парсинга кэша:', error);
    return null;
  }

}

export function clearHitZoneCache() {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  console.log('🧹 Кэш очищен');
}


export function parseHitZoneData(apiResponse) {
  console.log('🔄 training-data.js: parseHitZoneData ВХОД:', {
    success: apiResponse?.success,
    hasData: !!apiResponse?.data,
    status: apiResponse?.status,
    hasCurrent: !!apiResponse?.timeFiltered?.current,
    hasNext: !!apiResponse?.timeFiltered?.next
  });

  // 1. Определяем какую тренировку использовать
  let mainTraining;
  let status = apiResponse?.status || 'no_trainings';
  
  if (apiResponse?.timeFiltered?.current) {
    mainTraining = apiResponse.timeFiltered.current;
    status = 'current';
  } else if (apiResponse?.timeFiltered?.next) {
    mainTraining = apiResponse.timeFiltered.next;
    status = 'next';
  } else if (apiResponse?.data) {
    mainTraining = apiResponse.data;
    status = 'available'; // Есть тренировка, но не по времени
  }
  
  if (!mainTraining) {
    console.log('parseHitZoneData: Нет данных для тренировки');
    return {
      success: false,
      error: apiResponse?.error || 'Нет данных',
      status: 'no_trainings',
      layout: 'page1_1',
      programCount: 1,
      clientCount: 0,
      trainingInfo: {
        name: 'HIT ZONE',
        trainer: 'Тренер',
        round: 1,
        totalRounds: 16,
        currentApproach: 1
      },
      programData: {},
      clients: [],
      Scheme: [],
      allPrograms: []
    };
  }

  // 2. Логируем статус
  console.log(`parseHitZoneData: статус "${status}", тренировка: "${mainTraining.Service?.Title}"`);

  // 3. Берем ВСЕ тренировки HIT ZONE для определения layout
  const allHitZoneTrainings = apiResponse.allHitZoneTrainings || [];
  
  // 4. Собираем данные ВСЕХ программ в HIT ZONE
  const allPrograms = allHitZoneTrainings.map(training => ({
    id: training.AppointmentID,
    name: training.Service?.Title || 'Без названия',
    trainer: training.Employee?.FullName || 'Тренер',
    startTime: training.StartDate,
    clients: training.Clients || [],
    clientCount: training.Clients?.length || 0,
    capacity: training.Capacity || 0,
    hasScheme: !!training.Scheme,
    // НОВОЕ: Добавляем тайминги тренировки
    training: training.training || null
  }));
  
  // 5. Считаем общее количество клиентов
  const totalClients = allPrograms.reduce((sum, program) => sum + program.clientCount, 0);
  
  // 6. ВЫБОР LAYOUT (сохраняем старую логику)
  let layout;
  const programCount = allPrograms.length;
  
  if (programCount >= 3) {
    layout = 'page1';
  } else if (programCount === 2) {
    layout = 'page1_3';
  } else if (programCount === 1) {
    if (totalClients <= 12) {
      layout = 'page1_1';
    } else if (totalClients <= 24) {
      layout = 'page1_2';
    } else {
      layout = 'page1_2';
    }
  } else {
    layout = 'page1_1';
  }
  
  console.log(`Выбран layout: ${layout} (${programCount} программ, ${totalClients} клиентов, статус: ${status})`);
  
  // 7. Клиенты основной тренировки
  const allClients = mainTraining.Clients || [];
  const formattedClients = allClients.map(client => ({
    ClientID: client.ClientID,
    Name: client.Name,
    Status: client.Status,
    StationID: client.StationID
  }));
  
  // 8. Scheme основной тренировки
  let Scheme = [];
  if (mainTraining.Scheme && Array.isArray(mainTraining.Scheme)) {
    Scheme = mainTraining.Scheme;
    console.log(`Scheme основной тренировки: ${Scheme.length} раундов`);
  }
  
  // 9. Формируем trainingInfo основной тренировки
  const trainingInfo = {
    // name: mainTraining.Service?.Title || 'HIT ZONE',
    name: mainTraining.Service?.Title || 'GYM ZONE',
    time: mainTraining.StartDate,
    endTime: mainTraining.EndDate,
    trainer: mainTraining.Employee?.FullName || 'Тренер',
    round: 1,
    totalRounds: Scheme.length || 16,
    currentApproach: 1,
    // НОВОЕ: Добавляем тайминги тренировки
    training: mainTraining.training || null,
    // НОВОЕ: Добавляем статус
    status: status
  };
  
  // 10. ProgramData
  const programData = {
    title: mainTraining.Service?.Title,
    description: mainTraining.Service?.Description,
    color: mainTraining.Service?.Color
  };
  
  const result = {
    success: true,
    status: status, // НОВОЕ: Добавляем статус
    layout: layout,
    programCount: programCount,
    clientCount: totalClients,
    trainingInfo: trainingInfo,
    programData: programData,
    clients: formattedClients,
    Scheme: Scheme,
    allPrograms: allPrograms,
    config: apiResponse.config,
    rawData: mainTraining,
    // НОВОЕ: Добавляем информацию о времени
    timeInfo: {
      currentTraining: apiResponse.timeFiltered?.current,
      nextTraining: apiResponse.timeFiltered?.next,
      status: status,
      refreshAt: status === 'current' ? mainTraining.EndDate : 
                 status === 'next' ? mainTraining.StartDate : null
    }
  };
  
  console.log('parseHitZoneData: финальный результат:', {
    status: result.status,
    layout: result.layout,
    programCount: result.programCount,
    totalClients: result.clientCount,
    hasScheme: result.Scheme.length > 0,
    refreshAt: result.timeInfo.refreshAt
  });

  return result;
}


// export async function loadHitZoneLayout() {

//     console.log('🔍 [1] loadHitZoneLayout вызван');
  
//     // Сначала проверим кэш
//     console.log('🔍 [2] Проверяю кэш...');
//     const cached = getCachedHitZoneData();

//     if (cached) {
//         console.log('✅ [3] Использую кэшированные данные');
//         return cached;
//     }
    
//     console.log('🔄 [4] Кэша нет, запрашиваю API...');
   
//     console.log('🔍 loadHitZoneLayout: проверка кэша...');
  
//   // 1. Пробуем получить данные из кэша
//   const cachedData = getCachedHitZoneData();
//   if (cachedData) {
//     console.log('📦 Использую кэшированные данные');
//     return cachedData;
//   }
  
//   console.log('🔄 Кэш пустой, запрашиваю новые данные...');

//   // 2. Запрашиваем новые данные
//   try {
//     console.log('loadHitZoneLayout: запуск...');
//     const apiResponse = await fetchTrainings();
//     console.log('loadHitZoneLayout: API ответ получен');
    
//     const result = parseHitZoneData(apiResponse);
//     console.log('loadHitZoneLayout: результат сформирован');
    
//     return result;
//   } catch (error) {
//     console.error('❌ Ошибка loadHitZoneLayout:', error);
//     return {
//       success: false,
//       error: error.message,
//       layout: 'page1_1',
//       programCount: 1,
//       clientCount: 0,
//       trainingInfo: {
//         name: 'HIT ZONE (Ошибка)',
//         trainer: 'Тренер',
//         round: 1,
//         totalRounds: 16,
//         currentApproach: 1
//       },
//       programData: {},
//       clients: [],
//       Scheme: [],
//       allPrograms: []
//     };
//   }
// }



const getTestData = () => {
  console.log('🧪 Возвращаем тестовые данные');
  
  return {
    success: true,
    layout: 'page1_1',
    programCount: 1,
    clientCount: 8,
    trainingInfo: {
      name: 'Steppe Burn (Тест)',
      time: '16:00',
      trainer: 'Нургалиева Зауре',
      round: 1,
      totalRounds: 16,
      currentApproach: 1,
      warmup_time: 3,
      exercise_time: 3,
      rest_time: 3,
      transition_time: 6
    },
    // ВАЖНО: Добавляем Scheme для тренировочного флоу!
    Scheme: [
      [
        { client_id: 'test-1', client_name: 'Тест Клиент 1', station_number: '1A' },
        { client_id: 'test-2', client_name: 'Тест Клиент 2', station_number: '2A' }
      ]
    ],
    clients: [],
    allPrograms: [],
    config: {}
  };
};


// src/utils/training-data.js
// export const loadHitZoneLayout = async (tvConfig = null) => {
//   try {
//     // Если передан конфиг телевизора - используем его
//     const config = tvConfig || getSavedTVConfig();
    
//     console.log('🚀 Запрос данных тренировки для:', config);
    
//     // В тестовом режиме возвращаем тестовые данные
//     // if (process.env.NODE_ENV === 'development' || TEST_MODE) {
//     //   return getTestData();
//     // }
//     if (TEST_MODE) {
//         console.log('🎯 ТЕСТОВЫЙ РЕЖИМ: возвращаем тестовые данные');
//         return getTestData();
//     }
    
//     // Реальный запрос к API
//     const response = await fetch(`${baseApiUrl}/site/trainings`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         gym_id: config.gym_id,
//         televisor_id: config.televisor_id,
//         room_id: config.room_id
//       })
//     });
    
//     const data = await response.json();
//     // ... обработка ответа
    
//   } catch (error) {
//     console.error('❌ Ошибка загрузки данных:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// };





// CHECKING CASH FIRST!!!
// export async function loadHitZoneLayout() {
//   console.log('🔍 [1] loadHitZoneLayout ВХОД');
  
//   try {
//     // 2. Проверка кэша
//     console.log('🔍 [2] Проверка кэша...');
//     const cached = getCachedHitZoneData();
    
//     if (cached) {
//       console.log('✅ [3] Возвращаю кэшированные данные');
//       return cached;
//     }
    
//     // 4. Запрос к API через fetchTrainings() - ОНА РАБОТАЕТ!
//     console.log('🔄 [4] Запрос fetchTrainings()...');
//     const apiResponse = await fetchTrainings();
//     console.log('📥 [5] fetchTrainings() вернул:', {
//       success: apiResponse?.success,
//       hasData: !!apiResponse?.data,
//       hasScheme: !!apiResponse?.data?.Scheme
//     });
    
//     if (!apiResponse?.success) {
//       console.error('❌ [5.1] API success = false');
//       throw new Error('API response not successful');
//     }
    
//     // 5. Парсинг
//     console.log('🔄 [6] Вызов parseHitZoneData()...');
//     let parsedData;
//     try {
//       parsedData = parseHitZoneData(apiResponse);
//       console.log('✅ [6.1] parseHitZoneData выполнена');
//     } catch (parseError) {
//       console.error('❌ [6.2] Ошибка в parseHitZoneData:', parseError);
//       throw parseError;
//     }
    
//     console.log('🎯 [7] Данные распарсены:', {
//       success: parsedData.success,
//       layout: parsedData.layout,
//       clientCount: parsedData.clientCount
//     });
    
//     // 6. Сохранение в кэш
//     console.log('💾 [8] Вызов cacheHitZoneData()...');
//     try {
//       cacheHitZoneData(parsedData);
//       console.log('✅ [8.1] cacheHitZoneData вызвана');
//     } catch (cacheError) {
//       console.error('❌ [8.2] Ошибка в cacheHitZoneData:', cacheError);
//       // Не прерываем цепочку, даже если кэширование не удалось
//     }
    
//     // 7. Возврат
//     console.log('✅ [9] Возвращаю данные');
//     return parsedData;
    
//   } catch (error) {
//     console.error('❌ [ERROR] Ошибка в loadHitZoneLayout:', error);
//     console.error('Stack:', error.stack);
//     throw error;
//   }
// }



export async function loadHitZoneLayout(options = {}) {
  const { useCacheAsFallback = true } = options;
  
  console.log('🔍 [1] loadHitZoneLayout ВХОД', { useCacheAsFallback });

//   console.log('🆔 Ищем тренировки для room_id:', tvConfig.room_id);
//     console.log('📋 По конфигурации это должен быть:', 
//     tvConfig.room_id === '71a5eec2-a066-11f0-9298-005056015d0b' ? 'GYM ZONE' : 
//     tvConfig.room_id === '8b550c93-cf91-11f0-92a9-005056015d0b' ? 'HIT ZONE' : 
//     'Неизвестная зона'
//   );
  
  try {
    // 1. СНАЧАЛА ПРОБУЕМ API
    console.log('🔄 [2] Пробую запросить свежие данные с API...');
    const apiResponse = await fetchTrainings();
    
    console.log('📥 [3] API ответ получен:', {
      success: apiResponse?.success,
      status: apiResponse?.status,
      hasCurrent: !!apiResponse?.timeFiltered?.current,
      hasNext: !!apiResponse?.timeFiltered?.next
    });
    
    if (apiResponse?.success) {
      // 2. ПАРСИМ ДАННЫЕ
      console.log('🔄 [4] API успешен, парсим данные...');
      let parsedData;
      try {
        parsedData = parseHitZoneData(apiResponse);
        console.log('✅ [5] Данные спарсены, статус:', parsedData.status);
      } catch (parseError) {
        console.error('❌ [5.1] Ошибка парсинга:', parseError);
        throw parseError;
      }
      
      // 3. КЭШИРУЕМ ТОЛЬКО ЕСЛИ ЭТО АКТУАЛЬНАЯ ТРЕНИРОВКА
      // Не кэшируем состояние "следующая тренировка", если она далеко
      if (parsedData.status === 'current' || parsedData.status === 'next') {
        const startTime = new Date(parsedData.timeInfo?.nextTraining?.StartDate || parsedData.trainingInfo.time);
        const now = new Date();
        const minutesUntil = Math.round((startTime - now) / 60000);
        
        // Кэшируем только если тренировка в пределах 2 часов
        if (minutesUntil <= 120) {
          console.log('💾 [6] Сохраняю в кэш (тренировка скоро)...');
          try {
            cacheHitZoneData(parsedData);
            console.log('✅ [6.1] Данные сохранены в кэш');
          } catch (cacheError) {
            console.error('❌ [6.2] Ошибка кэширования:', cacheError);
          }
        } else {
          console.log('⏰ [6] Не кэширую - тренировка слишком далеко (через', minutesUntil, 'мин)');
        }
      }
      
      // 4. ВОЗВРАЩАЕМ СВЕЖИЕ ДАННЫЕ
      console.log('✅ [7] Возвращаю свежие данные с API, статус:', parsedData.status);
      return {
        ...parsedData,
        source: 'api-fresh',
        timestamp: Date.now()
      };
    }
    
    // 5. ЕСЛИ API НЕ УСПЕШЕН - ПРОВЕРЯЕМ КЭШ
    if (useCacheAsFallback) {
      console.log('⚠️ [8] API не успешен, проверяю кэш...');
      const cached = getCachedHitZoneData();
      
      if (cached) {
        console.log('✅ [9] Возвращаю данные из кэша, статус:', cached.status);
        
        // Проверяем, не устарели ли кэшированные данные по времени
        if (cached.timeInfo?.refreshAt) {
          const refreshTime = new Date(cached.timeInfo.refreshAt);
          const now = new Date();
          
          if (now > refreshTime) {
            console.log('⏰ [9.1] Кэшированные данные устарели (по времени refreshAt)');
            // Не возвращаем устаревшие данные
          } else {
            return {
              ...cached,
              source: 'cache-fallback',
              apiError: apiResponse?.error
            };
          }
        } else {
          return {
            ...cached,
            source: 'cache-fallback',
            apiError: apiResponse?.error
          };
        }
      }
    }
    
    // 6. ЕСЛИ НИ API НИ КЭШ НЕ РАБОТАЮТ
    console.error('❌ [10] Нет ни свежих данных, ни кэша');
    throw new Error(apiResponse?.error || 'API request failed and no cache available');
    
  } catch (error) {
    console.error('❌ [ERROR] Критическая ошибка в loadHitZoneLayout:', error);
    
    // В крайнем случае - последняя попытка: кэш без условий
    if (useCacheAsFallback) {
      console.log('🆘 Последняя попытка: кэш любой ценой');
      const cached = getCachedHitZoneData();
      if (cached) {
        console.log('🆘 Возвращаю кэш из catch-блока, статус:', cached.status);
        return {
          ...cached,
          source: 'cache-emergency',
          error: error.message
        };
      }
    }
    
    throw error;
  }
}



// Функция для получения сохраненной конфигурации
const getSavedTVConfig = () => {
  const saved = localStorage.getItem('tvConfig');
  if (saved) {
    return JSON.parse(saved);
  }
  
  // Дефолтные значения если нет настроек
  return {
    gym_id: 1,
    televisor_id: 1,
    room_id: '8b550c93-cf91-11f0-92a9-005056015d0b'
  };
};