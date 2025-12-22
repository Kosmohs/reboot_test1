// src/utils/training-data.js - БЕЗ тестового режима
import { fetchTrainings } from './api';

/**
 * Анализирует данные HIT ZONE из Scheme
 */
export function parseHitZoneData(apiResponse) {
  if (!apiResponse?.success || !apiResponse.data) {
    return {
      success: false,
      error: apiResponse?.error || 'Нет данных',
      layout: 'page1_1', // Дефолт
      programs: [],
      clients: [],
      rawData: null
    };
  }
  
  const training = apiResponse.data;
  const config = apiResponse.config;
  
  // 1. Получаем уникальных клиентов
  const allClients = training.Clients || [];
  const uniqueClients = [...new Map(allClients.map(c => [c.ClientID, c])).values()];
  const clientCount = uniqueClients.length;
  
  // 2. Для HIT ZONE всегда 1 программа
  const programCount = 1;
  
  // 3. Определяем layout
  let layout;
  if (programCount === 1) {
    if (clientCount <= 12) {
      layout = 'page1_1';
    } else {
      layout = 'page1_2';
    }
  } else {
    layout = 'page1_1'; // Дефолт для HIT ZONE
  }
  
  // 4. Создаем структуру программы для отображения
  const programs = createHitZonePrograms(training, config);
  
  return {
    success: true,
    layout: layout,
    programs: programs,
    clients: uniqueClients,
    clientCount: clientCount,
    programCount: programCount,
    trainingInfo: {
      name: training.Service?.Title || 'HIT ZONE',
      time: training.StartDate,
      trainer: training.Employee?.FullName,
      room: training.Room?.Title || 'HIT ZONE',
      round: 1,
      totalRounds: training.Scheme?.length || 0
    },
    config: config,
    rawData: training
  };
}

/**
 * Создает структуру программ для HIT ZONE
 */
function createHitZonePrograms(training, tvConfig) {
  const scheme = training.Scheme || [];
  const stationIds = tvConfig.stationIds || [];
  
  // Фильтруем Scheme для текущего телевизора (первый раунд)
  const firstRound = scheme[0] || [];
  const stationsForThisTV = firstRound.filter(item => 
    stationIds.includes(item.station_id)
  );
  
  // Создаем одну программу
  const program = {
    id: training.AppointmentID,
    name: training.Service?.Title || 'HIT ZONE',
    clients: []
  };
  
  // Группируем клиентов по станциям для этого телевизора
  stationsForThisTV.forEach(station => {
    program.clients.push({
      id: station.client_id,
      name: station.client_name,
      station1: station.station_number,
      exercise: station.training?.name || '',
      video: station.training?.video || ''
    });
  });
  
  return [program]; // Всегда одна программа в массиве
}

/**
 * Загружает данные и определяет layout для HIT ZONE
 */
export async function loadHitZoneLayout() {
  try {
    const apiResponse = await fetchTrainings();
    return parseHitZoneData(apiResponse);
  } catch (error) {
    console.error('Ошибка загрузки HIT ZONE:', error);
    return {
      success: false,
      error: error.message,
      layout: 'page1_1', // Дефолт при ошибке
      programs: [],
      clients: []
    };
  }
}

// Старые функции для совместимости (оставляем)
export function groupStationsForPage21(parsedData) {
  console.warn('groupStationsForPage21 устарела');
  return [];
}

export function groupStationsForPage1(parsedData) {
  console.warn('groupStationsForPage1 устарела');
  return [];
}