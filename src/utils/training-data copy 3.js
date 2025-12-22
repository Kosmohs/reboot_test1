// src/utils/training-data.js - ИСПРАВЛЕННАЯ версия
import { fetchTrainings } from './api';

export function parseHitZoneData(apiResponse) {
  console.log('parseHitZoneData: входные данные:', {
    success: apiResponse?.success,
    hasData: !!apiResponse?.data,
    dataKeys: apiResponse?.data ? Object.keys(apiResponse.data) : 'нет данных'
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
      Scheme: [] // ⭐ ВАЖНО: пустой массив вместо undefined
    };
  }
  
  const training = apiResponse.data;
  const config = apiResponse.config;
  
  console.log('parseHitZoneData: тренировка:', {
    name: training.Service?.Title,
    trainer: training.Employee?.FullName,
    hasScheme: !!training.Scheme,
    schemeLength: training.Scheme?.length,
    hasClients: !!training.Clients,
    clientsCount: training.Clients?.length
  });
  
  // 1. Клиенты - из поля Clients (с заглавной C!)
  const allClients = training.Clients || [];
  console.log('parseHitZoneData: все клиенты:', allClients);
  
  // Преобразуем клиентов в правильный формат
  const formattedClients = allClients.map(client => ({
    ClientID: client.ClientID,
    Name: client.Name,
    Status: client.Status,
    StationID: client.StationID
  }));
  
  const clientCount = formattedClients.length;
  
  // 2. Всегда 1 программа для HIT ZONE
  const programCount = 1;
  
//   // 3. Определяем layout
//   let layout;
//   if (clientCount <= 12) {
//     layout = 'page1_1';
//   } else if (clientCount <= 24) {
//     layout = 'page1_2';
//   } else {
//     layout = 'page1_1'; // Дефолт
//   }

    // 1. Получаем ВСЕ тренировки в HIT ZONE (не только текущую)
  const allHitZoneTrainings = apiResponse.allData?.filter(item => 
    item.Room?.Id === '8b550c93-cf91-11f0-92a9-005056015d0b' // HIT ZONE
  ) || [];
  
  const programCount = allHitZoneTrainings.length;
  const totalClients = allHitZoneTrainings.reduce((sum, t) => 
    sum + (t.Clients?.length || 0), 0
  );

  // 2. Выбираем layout по ТВОИМ правилам:
  if (programCount === 3) {
    layout = 'page1';        // ✅ 3 программы (каждая до 8 клиентов)
  } else if (programCount === 2) {
    layout = 'page1_3';      // ✅ 2 программы (каждая до 12 клиентов)
  } else if (programCount === 1) {
    if (totalClients <= 12) {
      layout = 'page1_1';    // ✅ 1 программа, 1-12 клиентов
    } else {
      layout = 'page1_2';    // ✅ 1 программа, 12-24 клиентов
    }
  } else {
    layout = 'page1';      // Дефолт
  }
  
  console.log(`Выбран layout: ${layout} (${programCount} программ, ${totalClients} клиентов)`);
  
  // 4. Scheme - проверяем наличие и формат
  let Scheme = [];
  if (training.Scheme && Array.isArray(training.Scheme)) {
    Scheme = training.Scheme;
    console.log(`parseHitZoneData: Scheme загружен, ${Scheme.length} раундов`);
  } else {
    console.warn('parseHitZoneData: Нет данных Scheme или неверный формат');
  }
  
  // 5. Формируем trainingInfo
  const trainingInfo = {
    name: training.Service?.Title || 'HIT ZONE',
    time: training.StartDate,
    trainer: training.Employee?.FullName || 'Тренер',
    round: 1,
    totalRounds: Scheme.length || 16,
    currentApproach: 1
  };
  
  // 6. ProgramData
  const programData = {
    title: training.Service?.Title,
    description: training.Service?.Description,
    color: training.Service?.Color
  };
  
  const result = {
    success: true,
    layout: layout,
    programCount: programCount,
    clientCount: clientCount,
    trainingInfo: trainingInfo,
    programData: programData,
    clients: formattedClients, // ⭐ clients (маленькая c) для Page11
    Scheme: Scheme, // ⭐ Scheme (большая S) для Page11
    config: config,
    rawData: training
  };
  
  console.log('parseHitZoneData: результат:', {
    layout: result.layout,
    clientCount: result.clientCount,
    hasScheme: result.Scheme.length > 0,
    hasClients: result.clients.length > 0
  });
  
  return result;
}

export async function loadHitZoneLayout() {
  try {
    console.log('loadHitZoneLayout: запуск...');
    const apiResponse = await fetchTrainings();
    console.log('loadHitZoneLayout: API ответ получен');
    
    const result = parseHitZoneData(apiResponse);
    console.log('loadHitZoneLayout: результат сформирован');
    
    return result;
  } catch (error) {
    console.error('❌ Ошибка loadHitZoneLayout:', error);
    return {
      success: false,
      error: error.message,
      layout: 'page1_1',
      programCount: 1,
      clientCount: 0,
      trainingInfo: {
        name: 'HIT ZONE (Ошибка)',
        trainer: 'Тренер',
        round: 1,
        totalRounds: 16,
        currentApproach: 1
      },
      programData: {},
      clients: [],
      Scheme: []
    };
  }
}

// Старые функции для совместимости
export function groupStationsForPage21() {
  return [];
}

export function groupStationsForPage1() {
  return [];
}