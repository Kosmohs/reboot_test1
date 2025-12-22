// src/config/tv-config.js

/**
 * Конфигурация всех телевизоров
 * Формат: tv_id: { gym_id, room_id, televisor_id, tv_name }
 */
const TV_CONFIGS = {
  // ================== ЗАЛ 1 (clubId: 1) ==================
  
  // Комната: 71a5eec2-a066-11f0-9298-005056015d0b
  'tv-room1-1': {
    gym_id: 1,
    room_id: '71a5eec2-a066-11f0-9298-005056015d0b',
    televisor_id: 1,
    tv_name: '1 ТV (Big)'
  },
  'tv-room1-2': {
    gym_id: 1,
    room_id: '71a5eec2-a066-11f0-9298-005056015d0b',
    televisor_id: 2,
    tv_name: '2 ТV (Big)'
  },
  'tv-room1-3': {
    gym_id: 1,
    room_id: '71a5eec2-a066-11f0-9298-005056015d0b',
    televisor_id: 3,
    tv_name: '3 ТV (Big)'
  },
  'tv-room1-4': {
    gym_id: 1,
    room_id: '71a5eec2-a066-11f0-9298-005056015d0b',
    televisor_id: 4,
    tv_name: '1 ТV'
  },
  
  // Комната: 8b550c93-cf91-11f0-92a9-005056015d0b
  'tv-room2-1': {
    gym_id: 1,
    room_id: '8b550c93-cf91-11f0-92a9-005056015d0b',
    televisor_id: 5,
    tv_name: '1 ТV (Big)'
  },
  'tv-room2-2': {
    gym_id: 1,
    room_id: '8b550c93-cf91-11f0-92a9-005056015d0b',
    televisor_id: 6,
    tv_name: '2 ТV (Big)'
  },
  'tv-room2-3': {
    gym_id: 1,
    room_id: '8b550c93-cf91-11f0-92a9-005056015d0b',
    televisor_id: 7,
    tv_name: '3 ТV (Big)'
  },
  'tv-room2-4': {
    gym_id: 1,
    room_id: '8b550c93-cf91-11f0-92a9-005056015d0b',
    televisor_id: 8,
    tv_name: '4 ТV (Big)'
  },
  'tv-room2-5': {
    gym_id: 1,
    room_id: '8b550c93-cf91-11f0-92a9-005056015d0b',
    televisor_id: 9,
    tv_name: '5 ТV'
  },
  'tv-room2-6': {
    gym_id: 1,
    room_id: '8b550c93-cf91-11f0-92a9-005056015d0b',
    televisor_id: 10,
    tv_name: '6 ТV'
  },
  'tv-room2-7': {
    gym_id: 1,
    room_id: '8b550c93-cf91-11f0-92a9-005056015d0b',
    televisor_id: 11,
    tv_name: '7 TV'
  },
  'tv-room2-8': {
    gym_id: 1,
    room_id: '8b550c93-cf91-11f0-92a9-005056015d0b',
    televisor_id: 12,
    tv_name: '8 ТV'
  },
  'tv-room2-9': {
    gym_id: 1,
    room_id: '8b550c93-cf91-11f0-92a9-005056015d0b',
    televisor_id: 13,
    tv_name: '9 ТV'
  },
  'tv-room2-10': {
    gym_id: 1,
    room_id: '8b550c93-cf91-11f0-92a9-005056015d0b',
    televisor_id: 14,
    tv_name: '10 ТV'
  },
  
  // ================== ДОПОЛНИТЕЛЬНЫЕ ТЕЛЕВИЗОРЫ (примеры) ==================
  'tv-hall2-room1-1': {
    gym_id: 2,
    room_id: 'room-uuid-here-1',
    televisor_id: 15,
    tv_name: 'TV Hall 2 Room 1-1'
  },
  'tv-hall2-room1-2': {
    gym_id: 2,
    room_id: 'room-uuid-here-1',
    televisor_id: 16,
    tv_name: 'TV Hall 2 Room 1-2'
  },
  'tv-hall3-room1-1': {
    gym_id: 3,
    room_id: 'room-uuid-here-2',
    televisor_id: 17,
    tv_name: 'TV Hall 3 Room 1-1'
  },
  'tv-hall4-room1-1': {
    gym_id: 4,
    room_id: 'room-uuid-here-3',
    televisor_id: 18,
    tv_name: 'TV Hall 4 Room 1-1'
  },
  'tv-hall5-room1-1': {
    gym_id: 5,
    room_id: 'room-uuid-here-4',
    televisor_id: 19,
    tv_name: 'TV Hall 5 Room 1-1'
  },
  'tv-hall6-room1-1': {
    gym_id: 6,
    room_id: 'room-uuid-here-5',
    televisor_id: 20,
    tv_name: 'TV Hall 6 Room 1-1'
  }
};

/**
 * Получает конфигурацию телевизора
 * @param {string} tvId - ID телевизора из URL (?tv_id=...)
 * @returns {Object|null} Конфигурация телевизора
 */
export function getTVConfig(tvId = null) {
  // 1. Пробуем получить из localStorage (если уже настроен)
  const storedGymId = localStorage.getItem('gym_id');
  const storedRoomId = localStorage.getItem('room_id');
  const storedTelevisorId = localStorage.getItem('televisor_id');
  
  if (storedGymId && storedRoomId && storedTelevisorId) {
    return {
      gym_id: parseInt(storedGymId),
      room_id: storedRoomId,
      televisor_id: parseInt(storedTelevisorId)
    };
  }
  
  // 2. Получаем tvId из URL параметра или используем дефолтный
  const urlParams = new URLSearchParams(window.location.search);
  const tvIdFromUrl = tvId || urlParams.get('tv_id') || 'tv-room1-4'; // Дефолт для разработки
  
  // 3. Ищем конфигурацию
  const config = TV_CONFIGS[tvIdFromUrl];
  
  if (config) {
    // Сохраняем в localStorage для будущих загрузок
    localStorage.setItem('gym_id', config.gym_id);
    localStorage.setItem('room_id', config.room_id);
    localStorage.setItem('televisor_id', config.televisor_id);
    
    console.log(`✅ Телевизор настроен: ${tvIdFromUrl}`, config);
    return config;
  }
  
  // 4. Если конфигурация не найдена
  console.error(`❌ Конфигурация для tv_id="${tvIdFromUrl}" не найдена!`);
  console.log('Доступные конфигурации:', Object.keys(TV_CONFIGS));
  
  // Возвращаем дефолтную конфигурацию (для отладки)
  return {
    gym_id: 1,
    room_id: '71a5eec2-a066-11f0-9298-005056015d0b',
    televisor_id: 4
  };
}

/**
 * Получает все доступные конфигурации (для отладки)
 */
export function getAllTVConfigs() {
  return TV_CONFIGS;
}

export default TV_CONFIGS;