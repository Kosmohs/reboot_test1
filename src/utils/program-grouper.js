// src/utils/program-grouper.js

/**
 * Группирует тренировки по времени и программе
 */
export function groupProgramsByTime(apiData, targetTime = null) {
  // ... (предыдущий код без изменений)
  return programs;
}

/**
 * Определяет какой макет использовать
 * @param {Array} programs - массив программ
 * @returns {string} тип макета: 
 *   '3-programs'       -> Page1
 *   '2-programs'       -> Page1_3
 *   '1-program-small'  -> Page1_1 (до 12 клиентов)
 *   '1-program-large'  -> Page1_2 (13-24 клиентов)
 */
export function determineLayout(programs) {
  if (!programs || programs.length === 0) {
    return 'no-data';
  }
  
  const totalPrograms = programs.length;
  const totalClients = programs.reduce((sum, prog) => sum + (prog.clients?.length || prog.totalClients || 0), 0);
  
  console.log(`program-grouper: Программ: ${totalPrograms}, Клиентов: ${totalClients}`);
  
  if (totalPrograms === 3) {
    return '3-programs'; // Page1
  } 
  else if (totalPrograms === 2) {
    return '2-programs'; // Page1_3
  }
  else if (totalPrograms === 1) {
    // Для одной программы смотрим количество клиентов
    const clientsCount = programs[0].clients?.length || 0;
    
    if (clientsCount <= 12) {
      return '1-program-small'; // Page1_1 (до 12 клиентов)
    } else {
      return '1-program-large'; // Page1_2 (13-24 клиентов)
    }
  }
  else {
    // Если программ больше 3, берем первые 3
    console.warn(`program-grouper: Программ больше 3 (${totalPrograms}), берем первые 3`);
    return '3-programs'; // Page1
  }
}

/**
 * Форматирует данные для конкретного макета
 * @param {Array} programs - исходные программы
 * @param {string} layoutType - тип макета
 * @returns {Array} форматированные данные для компонента
 */
export function formatDataForLayout(programs, layoutType) {
  if (!programs || programs.length === 0) {
    return [];
  }
  
  switch (layoutType) {
    case '3-programs':
      // Для Page1: максимум 3 программы
      return programs.slice(0, 3).map((program, index) => ({
        programName: program.name,
        stations: formatStationsForProgram(program),
        totalClients: program.clients?.length || 0,
        clients: program.clients || []
      }));
      
    case '2-programs':
      // Для Page1_3: максимум 2 программы
      return programs.slice(0, 2).map((program, index) => ({
        programName: program.name,
        stations: formatStationsForProgram(program),
        totalClients: program.clients?.length || 0,
        clients: program.clients || []
      }));
      
    case '1-program-small':
    case '1-program-large':
      // Для Page1_1 и Page1_2: 1 программа
      const program = programs[0];
      return [{
        programName: program.name,
        stations: formatStationsForProgram(program),
        totalClients: program.clients?.length || 0,
        clients: program.clients || []
      }];
      
    default:
      return programs;
  }
}

/**
 * Форматирует станции для программы
 * @param {Object} program - программа
 * @returns {Array} форматированные станции
 */
function formatStationsForProgram(program) {
  if (!program.stations || program.stations.length === 0) {
    return getDemoStations(program.clients?.length || 0);
  }
  
  // TODO: Реальная логика форматирования станций
  // Пока возвращаем демо-станции
  return getDemoStations(program.clients?.length || 0);
}

/**
 * Демо-станции для тестирования
 */
function getDemoStations(clientCount) {
  const stations = [];
  const stationNumbers = ['7', '6', '15', '13', '1', '2', '3', '4'];
  
  // Создаем станции для клиентов
  for (let i = 0; i < Math.min(clientCount, 8); i++) {
    stations.push({
      station1: stationNumbers[i * 2 % stationNumbers.length] || (i + 1).toString(),
      station2: stationNumbers[(i * 2 + 1) % stationNumbers.length] || (i + 2).toString(),
      clientName: `Клиент ${i + 1}`
    });
  }
  
  return stations;
}






// src/utils/program-grouper.js - добавляем в конец файла (после всех других функций)

/**
 * Тестовые данные для разных макетов (пока API не работает)
 * @param {string} layoutType - тип макета: '3-programs', '2-programs', '1-program-small', '1-program-large'
 * @returns {Array} массив программ
 */
export function getTestPrograms(layoutType = '3-programs') {
  // Генератор клиентов
  const generateClients = (count, startFrom = 1) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `client-${startFrom + i}`,
      name: `Клиент ${startFrom + i}`,
      // Можно добавить больше полей позже
      photo: null,
      station1: ((i * 2) % 8) + 1, // Демо номера станций
      station2: ((i * 2 + 1) % 8) + 1
    }));
  };

  // Генератор станций
  const generateStations = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `station-${i + 1}`,
      number: (i + 1).toString(),
      name: `Станция ${i + 1}`,
      exercise: `Упражнение ${i + 1}`
    }));
  };

  // Тестовые данные для каждого макета
  const testData = {
    // Page1: 3 программы по 8 клиентов
    '3-programs': [
      {
        id: 'program-1',
        programId: '71a5eec5-a066-11f0-9298-005056015d0b',
        name: 'Arms & Shoulders Level 1',
        trainer: 'Иван Петров',
        startTime: '13:00',
        endTime: '13:55',
        clients: generateClients(8, 1),
        stations: generateStations(6),
        totalClients: 8,
        duration: 55
      },
      {
        id: 'program-2',
        programId: '71a5eec6-a066-11f0-9298-005056015d0b',
        name: 'Legs & Core Pro',
        trainer: 'Мария Сидорова',
        startTime: '13:00',
        endTime: '13:55',
        clients: generateClients(8, 9),
        stations: generateStations(6),
        totalClients: 8,
        duration: 55
      },
      {
        id: 'program-3',
        programId: '71a5eec7-a066-11f0-9298-005056015d0b',
        name: 'Full Body Circuit',
        trainer: 'Алексей Иванов',
        startTime: '13:00',
        endTime: '13:55',
        clients: generateClients(8, 17),
        stations: generateStations(6),
        totalClients: 8,
        duration: 55
      }
    ],
    
    // Page1_3: 2 программы по 12 клиентов
    '2-programs': [
      {
        id: 'program-1',
        programId: '81a5eec5-a066-11f0-9298-005056015d0b',
        name: 'HIIT Training Max',
        trainer: 'Ольга Васильева',
        startTime: '14:00',
        endTime: '14:55',
        clients: generateClients(12, 1),
        stations: generateStations(8),
        totalClients: 12,
        duration: 55
      },
      {
        id: 'program-2',
        programId: '81a5eec6-a066-11f0-9298-005056015d0b',
        name: 'Yoga Flow Advanced',
        trainer: 'Дмитрий Смирнов',
        startTime: '14:00',
        endTime: '14:55',
        clients: generateClients(8, 13),
        stations: generateStations(8),
        totalClients: 8,
        duration: 55
      }
    ],
    
    // Page1_1: 1 программа до 12 клиентов
    '1-program-small': [
      {
        id: 'program-1',
        programId: '91a5eec5-a066-11f0-9298-005056015d0b',
        name: 'Morning Stretch & Relax',
        trainer: 'Екатерина Козлова',
        startTime: '09:00',
        endTime: '09:55',
        clients: generateClients(8, 1), // 8 клиентов
        stations: generateStations(4),
        totalClients: 8,
        duration: 55
      }
    ],
    
    // Page1_2: 1 программа 13-24 клиента
    '1-program-large': [
      {
        id: 'program-1',
        programId: 'a1a5eec5-a066-11f0-9298-005056015d0b',
        name: 'Full Day Fitness Marathon',
        trainer: 'Сергей Николаев',
        startTime: '10:00',
        endTime: '11:55',
        clients: generateClients(20, 1), // 20 клиентов
        stations: generateStations(12),
        totalClients: 20,
        duration: 115
      }
    ]
  };

  const result = testData[layoutType] || testData['3-programs'];
  console.log(`getTestPrograms: ${layoutType} -> ${result.length} программ, всего клиентов: ${
    result.reduce((sum, prog) => sum + prog.totalClients, 0)
  }`);
  
  return result;
}