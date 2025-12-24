// training-data.js - полная версия с логикой выбора layout
import { fetchTrainings } from './api';


// Добавляем функции для кэширования
const CACHE_KEY = 'hit_zone_data_cache';
const CACHE_TIMESTAMP_KEY = 'hit_zone_data_timestamp';
const CACHE_DURATION = 15 * 60 * 1000; // 15 минут

export function cacheHitZoneData(data) {
    console.log('💾 [CACHE] cacheHitZoneData вызвана');
    console.log('   Получены данные:', {
        success: data?.success,
        hasScheme: !!data?.Scheme,
        schemeLength: data?.Scheme?.length
    });
    
  try {
    const cacheData = {
      data: data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log('✅ Данные сохранены в кэш');
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
  
  try {
    const { data, timestamp } = JSON.parse(cachedStr);
    console.log('   ✅ Кэш распарсен успешно');
    console.log('   Время создания:', new Date(timestamp).toLocaleTimeString());
    console.log('   Данные:', {
      success: data?.success,
      layout: data?.layout
    });
    
    return data;
  } catch (error) {
    console.error('   ❌ Ошибка парсинга кэша:', error);
    console.log('   Сырые данные (первые 200 символов):', cachedStr.substring(0, 200));
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
    dataTitle: apiResponse?.data?.Service?.Title,
    hasScheme: !!apiResponse?.data?.Scheme,
    hasAllHitZoneTrainings: !!apiResponse?.allHitZoneTrainings,
    allHitZoneTrainingsLength: apiResponse?.allHitZoneTrainings?.length
  });

  console.log('parseHitZoneData: входные данные:', {
    success: apiResponse?.success,
    hasData: !!apiResponse?.data,
    hitZoneTrainingsCount: apiResponse?.allHitZoneTrainings?.length || 0
  });
  
  if (!apiResponse?.success || !apiResponse.data) {
    console.log('parseHitZoneData: Нет данных');
    return {
      success: false,
      error: apiResponse?.error || 'Нет данных',
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
      allPrograms: [] // Добавляем для совместимости
    };
  }
  
  const mainTraining = apiResponse.data;
  const config = apiResponse.config;
  const allHitZoneTrainings = apiResponse.allHitZoneTrainings || [];
  
  console.log('parseHitZoneData: информация о тренировках:', {
    totalProgramsInHITZONE: allHitZoneTrainings.length,
    mainTrainingName: mainTraining.Service?.Title,
    hasScheme: !!mainTraining.Scheme
  });
  
  // 1. Собираем данные ВСЕХ программ в HIT ZONE
  const allPrograms = allHitZoneTrainings.map(training => ({
    id: training.AppointmentID,
    name: training.Service?.Title || 'Без названия',
    trainer: training.Employee?.FullName || 'Тренер',
    startTime: training.StartDate,
    clients: training.Clients || [],
    clientCount: training.Clients?.length || 0,
    capacity: training.Capacity || 0,
    hasScheme: !!training.Scheme
  }));
  
  // 2. Считаем общее количество клиентов
  const totalClients = allPrograms.reduce((sum, program) => sum + program.clientCount, 0);
  
  // 3. ВЫБОР LAYOUT ПО ТВОИМ ПРАВИЛАМ:
  let layout;
  const programCount = allPrograms.length;
  
  // ПРАВИЛО 1: 3 программы → page1
  if (programCount >= 3) {
    layout = 'page1';
  }
  // ПРАВИЛО 2: 2 программы → page1_3
  else if (programCount === 2) {
    layout = 'page1_3';
  }
  // ПРАВИЛО 3: 1 программа
  else if (programCount === 1) {
    // ПРАВИЛО 3а: 1-12 клиентов → page1_1
    if (totalClients <= 12) {
      layout = 'page1_1';
    }
    // ПРАВИЛО 3б: 13-24 клиентов → page1_2
    else if (totalClients <= 24) {
      layout = 'page1_2';
    }
    // ПРАВИЛО 3в: больше 24 клиентов → page1_2 (максимум)
    else {
      layout = 'page1_2';
    }
  }
  // ПРАВИЛО 4: Нет программ → page1_1 (дефолт)
  else {
    layout = 'page1_1';
  }
  
  console.log(`Выбран layout: ${layout} (${programCount} программ, ${totalClients} клиентов)`);
  
  // 4. Клиенты основной тренировки
  const allClients = mainTraining.Clients || [];
  const formattedClients = allClients.map(client => ({
    ClientID: client.ClientID,
    Name: client.Name,
    Status: client.Status,
    StationID: client.StationID
  }));
  
  // 5. Scheme основной тренировки
  let Scheme = [];
  if (mainTraining.Scheme && Array.isArray(mainTraining.Scheme)) {
    Scheme = mainTraining.Scheme;
    console.log(`Scheme основной тренировки: ${Scheme.length} раундов`);
  }
  
  // 6. Формируем trainingInfo основной тренировки
  const trainingInfo = {
    name: mainTraining.Service?.Title || 'HIT ZONE',
    time: mainTraining.StartDate,
    trainer: mainTraining.Employee?.FullName || 'Тренер',
    round: 1,
    totalRounds: Scheme.length || 16,
    currentApproach: 1
  };
  
  // 7. ProgramData
  const programData = {
    title: mainTraining.Service?.Title,
    description: mainTraining.Service?.Description,
    color: mainTraining.Service?.Color
  };
  
  const result = {
    success: true,
    layout: layout,
    programCount: programCount,        // Реальное количество программ
    clientCount: totalClients,         // Общее количество клиентов
    trainingInfo: trainingInfo,
    programData: programData,
    clients: formattedClients,         // Клиенты основной тренировки
    Scheme: Scheme,                    // Scheme основной тренировки
    allPrograms: allPrograms,          // Все программы для отображения
    config: config,
    rawData: mainTraining
  };
  
  console.log('parseHitZoneData: финальный результат:', {
    layout: result.layout,
    programCount: result.programCount,
    totalClients: result.clientCount,
    hasScheme: result.Scheme.length > 0,
    hasClients: result.clients.length > 0
  });

  console.log('🔄 training-data.js: parseHitZoneData ВЫХОД:', {
    layout: result.layout,
    programCount: result.programCount,
    clientCount: result.clientCount,
    hasScheme: result.Scheme?.length > 0,
    hasClients: result.clients?.length > 0
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

export async function loadHitZoneLayout() {
  console.log('🔍 [1] loadHitZoneLayout ВХОД');
  
  try {
    // 2. Проверка кэша
    console.log('🔍 [2] Проверка кэша...');
    const cached = getCachedHitZoneData();
    
    if (cached) {
      console.log('✅ [3] Возвращаю кэшированные данные');
      return cached;
    }
    
    // 4. Запрос к API
    console.log('🔄 [4] Запрос fetchTrainings()...');
    const apiResponse = await fetchTrainings();
    console.log('📥 [5] fetchTrainings() вернул:', {
      success: apiResponse?.success,
      hasData: !!apiResponse?.data,
      hasScheme: !!apiResponse?.data?.Scheme
    });
    
    if (!apiResponse?.success) {
      console.error('❌ [5.1] API success = false');
      throw new Error('API response not successful');
    }
    
    // 5. Парсинг
    console.log('🔄 [6] Вызов parseHitZoneData()...');
    let parsedData;
    try {
      parsedData = parseHitZoneData(apiResponse);
      console.log('✅ [6.1] parseHitZoneData выполнена');
    } catch (parseError) {
      console.error('❌ [6.2] Ошибка в parseHitZoneData:', parseError);
      throw parseError;
    }
    
    console.log('🎯 [7] Данные распарсены:', {
      success: parsedData.success,
      layout: parsedData.layout,
      clientCount: parsedData.clientCount
    });
    
    // 6. Сохранение в кэш
    console.log('💾 [8] Вызов cacheHitZoneData()...');
    try {
      cacheHitZoneData(parsedData);
      console.log('✅ [8.1] cacheHitZoneData вызвана');
    } catch (cacheError) {
      console.error('❌ [8.2] Ошибка в cacheHitZoneData:', cacheError);
      // Не прерываем цепочку, даже если кэширование не удалось
    }
    
    // 7. Возврат
    console.log('✅ [9] Возвращаю данные');
    return parsedData;
    
  } catch (error) {
    console.error('❌ [ERROR] Ошибка в loadHitZoneLayout:', error);
    console.error('Stack:', error.stack);
    throw error;
  }
}