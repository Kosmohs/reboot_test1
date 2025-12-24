// src/config/tv-config.js
/**
 * Дефолтные настройки (если телевизор не настроен)
 */
export const DEFAULT_TV_CONFIG = {
  gym_id: 1,
  // room_id: '8b550c93-cf91-11f0-92a9-005056015d0b', // HIT ZONE по умолчанию
  room_id: '71a5eec2-a066-11f0-9298-005056015d0b', // GYM ZONE по умолчанию
  // televisor_id: 4,
  televisor_id: 1,
  tv_name: 'Не настроен',
  requires_setup: true
};

/**
 * Получает конфигурацию телевизора
 * 1. Сначала проверяет localStorage
 * 2. Если нет — возвращает дефолтную
 */
export function getTVConfig() {
  const savedConfig = localStorage.getItem('tvConfig');
  
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig);
      console.log('✅ Используем сохраненную конфигурацию телевизора');
      return {
        ...DEFAULT_TV_CONFIG,
        ...config, // Переопределяем сохраненными значениями
        requires_setup: false
      };
    } catch (error) {
      console.error('❌ Ошибка парсинга сохраненной конфигурации:', error);
    }
  }
  
  console.warn('⚠️ Телевизор не настроен, используем дефолтную конфигурацию');
  return DEFAULT_TV_CONFIG;
}

/**
 * Сохраняет конфигурацию телевизора
 */
export function saveTVConfig(config) {
  try {
    const fullConfig = {
      ...config,
      last_updated: new Date().toISOString()
    };
    
    localStorage.setItem('tvConfig', JSON.stringify(fullConfig));
    console.log('💾 Конфигурация телевизора сохранена:', fullConfig);
    return true;
  } catch (error) {
    console.error('❌ Ошибка сохранения конфигурации:', error);
    return false;
  }
}

/**
 * Проверяет, настроен ли телевизор
 */
export function isTVConfigured() {
  const config = getTVConfig();
  return !config.requires_setup;
}