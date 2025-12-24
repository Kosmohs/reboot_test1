// src/config/gyms-config.js
export const GYMS_CONFIG = {
  // Фитнес-клуб ID: 1
  1: {
    gym_id: 1,
    name: 'FIT CLUB',
    address: 'Основной зал',
    rooms: [
      {
        room_id: '8b550c93-cf91-11f0-92a9-005056015d0b',
        name: 'HIT ZONE',
        description: 'Зал высокой интенсивности',
        capacity: 16
      },
      {
        room_id: '71a5eec2-a066-11f0-9298-005056015d0b',
        name: 'GYM ZONE',
        description: 'Основной тренажерный зал',
        capacity: 30
      },
      {
        room_id: 'ab64a89f-cf94-11f0-92a9-005056015d0b',
        name: 'GROUP ZONE',
        description: 'Групповые занятия',
        capacity: 12
      },
      {
        room_id: '6847d160-d6b0-11f0-92ab-005056015d0b',
        name: 'Массажный Кабинет',
        description: 'Массажный кабинет',
        capacity: 0
      }
    ]
  }
};