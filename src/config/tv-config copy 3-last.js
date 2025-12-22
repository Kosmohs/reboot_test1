// src/config/tv-config.js

/**
 * Конфигурация всех телевизоров
 * Формат: tv_id: { gym_id, room_id, televisor_id, tv_name }
 * ВСЕ 4 телевизора в ОДНОЙ комнате ОДНОГО зала
 */
const TV_CONFIGS = {
  // ================== ЗАЛ 1 (clubId: 1) ==================
  // Комната: 71a5eec2-a066-11f0-9298-005056015d0b
  // ВСЕ 4 телевизора в этой комнате
  
  'tv-1': {
    gym_id: 1,
    room_id: '71a5eec2-a066-11f0-9298-005056015d0b',
    televisor_id: 1,
    tv_name: 'Телевизор 1'
  },
  'tv-2': {
    gym_id: 1,
    room_id: '71a5eec2-a066-11f0-9298-005056015d0b',
    televisor_id: 2,
    tv_name: 'Телевизор 2'
  },
  'tv-3': {
    gym_id: 1,
    room_id: '71a5eec2-a066-11f0-9298-005056015d0b',
    televisor_id: 3,
    tv_name: 'Телевизор 3'
  },
  'tv-4': {
    gym_id: 1,
    room_id: '71a5eec2-a066-11f0-9298-005056015d0b',
    televisor_id: 4,
    tv_name: 'Телевизор 4'
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
    console.log('TV уже настроен в localStorage');
    
    // // ВСЕГДА пытаемся редиректить если TV настроен
    // redirectToSmartLayoutIfNeeded();
    
    return {
      gym_id: parseInt(storedGymId),
      room_id: storedRoomId,
      televisor_id: parseInt(storedTelevisorId),
      tv_name: `Телевизор ${storedTelevisorId}`
    };
  }
  
  // 2. Получаем tvId из URL параметра
  const urlParams = new URLSearchParams(window.location.search);
  const tvIdFromUrl = tvId || urlParams.get('tv_id') || 'tv-1'; // Дефолт первый телевизор
  
  // 3. Ищем конфигурацию
  const config = TV_CONFIGS[tvIdFromUrl];
  
  if (config) {
    // Сохраняем в localStorage для будущих загрузок
    localStorage.setItem('gym_id', config.gym_id);
    localStorage.setItem('room_id', config.room_id);
    localStorage.setItem('televisor_id', config.televisor_id);
    
    console.log(`✅ Телевизор настроен: ${tvIdFromUrl}`, config);

    // // ВСЕГДА редиректим после настройки
    // redirectToSmartLayoutIfNeeded();

    return config;
  }
  
  // 4. Если конфигурация не найдена - используем дефолтный tv-1
  console.warn(`⚠️ Конфигурация для tv_id="${tvIdFromUrl}" не найдена! Используем tv-1`);
  
  const defaultConfig = TV_CONFIGS['tv-1'];
  localStorage.setItem('gym_id', defaultConfig.gym_id);
  localStorage.setItem('room_id', defaultConfig.room_id);
  localStorage.setItem('televisor_id', defaultConfig.televisor_id);

//   // Автоматический редирект
//   // ВСЕГДА редиректим даже при fallback
//   redirectToSmartLayoutIfNeeded();
  
  return defaultConfig;
}


/**
 * Автоматический редирект на SmartLayoutRouter если нужно
 */
// function redirectToSmartLayoutIfNeeded() {
//   // Не редиректим если:
//   // 1. Уже на smart странице
//   // 2. На странице выбора зоны
//   // 3. На главной странице
//   const currentPath = window.location.pathname;
//   const excludedPaths = ['/smart', '/zone1', '/zone2', '/zone3', '/'];
  
//   if (excludedPaths.some(path => currentPath === path || currentPath.startsWith(path + '/'))) {
//     return;
//   }
  
//   // Редирект через небольшой таймаут для стабильности
//   setTimeout(() => {
//     const newUrl = `${window.location.origin}/smart${window.location.search}`;
//     console.log(`🔄 Автоматический редирект на SmartLayout: ${newUrl}`);
//     window.location.href = newUrl;
//   }, 300);
// }

// В tv-config.js функция redirectToSmartLayoutIfNeeded
// tv-config.js - полностью заменяем функцию redirectToSmartLayoutIfNeeded
function redirectToSmartLayoutIfNeeded() {
  const currentPath = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  const hasTvId = urlParams.has('tv_id');
  const isAlreadyConfigured = localStorage.getItem('gym_id');

  // НОВОЕ: Проверяем есть ли параметр ошибки
  const hasError = urlParams.has('error') || currentPath.includes('/error');
  
  if (hasError) {
    console.log('Редирект отменен: страница с ошибкой');
    return;
  }
  
  console.log('redirectToSmartLayoutIfNeeded:', {
    currentPath,
    hasTvId,
    isAlreadyConfigured,
    search: window.location.search
  });
  
  // Не редиректим если:
  // 1. Уже на smart странице
  // 2. На странице выбора зоны (оставляем для ручного выбора)
  const excludedPaths = ['/smart', '/zone1', '/zone2', '/zone3', '/home'];
  const shouldExclude = excludedPaths.some(path => 
    currentPath === path || currentPath.startsWith(path + '/')
  );
  
  if (shouldExclude) {
    console.log('Редирект отменен: страница в исключениях');
    return;
  }
  
  // РЕДИРЕКТИМ ЕСЛИ:
  // 1. Есть tv_id в URL ИЛИ
  // 2. TV уже настроен (есть в localStorage)
  const shouldRedirect = hasTvId || isAlreadyConfigured;
  
  if (shouldRedirect) {
    setTimeout(() => {
      // Сохраняем ВСЕ параметры из оригинального URL
      const originalSearch = window.location.search;
      const originalHash = window.location.hash;
      const newUrl = `${window.location.origin}/smart${originalSearch}${originalHash}`;
      
      console.log(`🔄 Автоматический редирект: ${currentPath} → /smart`);
      console.log(`   Причина: ${hasTvId ? 'tv_id в URL' : 'TV уже настроен'}`);
      
      // Используем replace вместо href чтобы не добавлять в историю
      window.location.replace(newUrl);
    }, 100);
  } else {
    console.log('Редирект не требуется: нет tv_id и TV не настроен');
  }
}

/**
 * Получает все доступные конфигурации (для отладки)
 */
export function getAllTVConfigs() {
  return TV_CONFIGS;
}

/**
 * Получает конфигурацию по televisor_id
 */
export function getConfigByTelevisorId(televisorId) {
  return Object.values(TV_CONFIGS).find(config => 
    config.televisor_id === parseInt(televisorId)
  ) || TV_CONFIGS['tv-1'];
}

export default TV_CONFIGS;