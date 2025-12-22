// src/config/tv-config.js - ТОЛЬКО HIT ZONE

/**
 * Конфигурация 4 телевизоров для HIT ZONE
 */
const HIT_ZONE_TV_CONFIGS = {
  // ================== HIT ZONE ==================
  // Комната: 8b550c93-cf91-11f0-92a9-005056015d0b
  // 4 больших телевизора
  
  // TV 1 (Big) - page1.jsx
  'hit-tv-1': {
    gym_id: 1,
    room_id: '8b550c93-cf91-11f0-92a9-005056015d0b', // HIT ZONE
    televisor_id: 9, // Из данных API
    tv_name: 'HIT Zone TV 1',
    stationIds: [1, 23], // station_id для 1A и 1B
    stationNumbers: ['1A', '1B'],
    component: 'page1'
  },
  
  // TV 2 (Big) - page1_1.jsx
  'hit-tv-2': {
    gym_id: 1,
    room_id: '8b550c93-cf91-11f0-92a9-005056015d0b',
    televisor_id: 9, // Из данных API
    tv_name: 'HIT Zone TV 2',
    stationIds: [2, 30], // station_id для 2A и 2B
    stationNumbers: ['2A', '2B'],
    component: 'page1_1'
  },
  
  // TV 3 (Big) - page2.jsx
  'hit-tv-3': {
    gym_id: 1,
    room_id: '8b550c93-cf91-11f0-92a9-005056015d0b',
    televisor_id: 9, // Из данных API
    tv_name: 'HIT Zone TV 3',
    stationIds: [3, 19], // station_id для 3A и 3B
    stationNumbers: ['3A', '3B'],
    component: 'page2'
  },
  
  // TV 4 (Big) - page2_1.jsx
  'hit-tv-4': {
    gym_id: 1,
    room_id: '8b550c93-cf91-11f0-92a9-005056015d0b',
    televisor_id: 9, // Из данных API
    tv_name: 'HIT Zone TV 4',
    stationIds: [4, 20], // station_id для 4A и 4B
    stationNumbers: ['4A', '4B'],
    component: 'page2_1'
  }
};

/**
 * Получает конфигурацию телевизора
 */
export function getTVConfig(tvId = null) {
  // 1. Получаем tvId из URL параметра
  const urlParams = new URLSearchParams(window.location.search);
  const tvIdFromUrl = tvId || urlParams.get('tv_id') || 'hit-tv-1';
  
  // 2. Ищем конфигурацию
  const config = HIT_ZONE_TV_CONFIGS[tvIdFromUrl];
  
  if (config) {
    console.log(`✅ HIT ZONE телевизор настроен: ${tvIdFromUrl}`, {
      televisor_id: config.televisor_id,
      room_id: config.room_id,
      stationIds: config.stationIds
    });
    return config;
  }
  
  // 3. Дефолтный конфиг
  console.warn(`⚠️ Конфигурация для tv_id="${tvIdFromUrl}" не найдена! Используем hit-tv-1`);
  return HIT_ZONE_TV_CONFIGS['hit-tv-1'];
}

/**
 * Получает конфигурацию по имени компонента
 */
export function getConfigByComponentName(componentName) {
  return Object.values(HIT_ZONE_TV_CONFIGS).find(config => 
    config.component === componentName
  ) || HIT_ZONE_TV_CONFIGS['hit-tv-1'];
}

export default HIT_ZONE_TV_CONFIGS;