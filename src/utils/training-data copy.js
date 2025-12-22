// src/utils/training-data.js

/**
 * Основной парсер данных тренировки
 */
export function parseTrainingData(apiData, televisorId = 4) {
  if (!apiData?.data?.length) {
    return {
      success: false,
      error: 'Нет данных о тренировках'
    };
  }

  // Находим тренировку для нашего телевизора
  const training = apiData.data.find(t => 
    t.training?.trainings?.some(st => st.televisor_id == televisorId)
  ) || apiData.data[0]; // Или первую если не нашли

  if (!training) {
    return {
      success: false,
      error: 'Нет тренировок для этого телевизора'
    };
  }

  // Базовая информация
  const trainingInfo = {
    id: training.AppointmentID,
    programName: training.Service?.Title || 'Тренировка',
    trainer: training.Employee?.FullName || 'Тренер',
    startTime: training.StartDate,
    endTime: training.EndDate,
    duration: training.Duration || 55,
    capacity: training.Capacity || 8,
    availableSlots: training.AvailableSlots || 8,
    
    // Времена (одинаковые для всех пока)
    exerciseTime: 60,     // 1 минута
    restTime: 45,        // 45 секунд
    transitionTime: 30,  // 30 секунд
    totalApproaches: 4   // Пока 4 подхода
  };

  // Все станции для нашего телевизора
  const allStations = training.training?.trainings?.filter(
    station => station.televisor_id == televisorId
  ) || [];

  // Форматируем станции
  const formattedStations = allStations.map((station, index) => ({
    id: station.id,
    stationId: station.station?.id,
    name: station.station?.name,
    number: station.station?.number, // "7", "6", "15"...
    exercise: station.training?.name,
    approaches: station.number_of_approaches || 4,
    video: station.training?.video,
    displayIndex: index + 1
  }));

  return {
    success: true,
    trainingInfo,
    allStations: formattedStations,
    hasClients: training.Clients && training.Clients.length > 0,
    clients: training.Clients || [],
    rawData: training
  };
}

/**
 * Группирует станции для Page21 (пары 7|6, 15|13...)
 */
export function groupStationsForPage21(stations) {
  const groups = [];
  
  for (let i = 0; i < stations.length; i += 2) {
    const station1 = stations[i];
    const station2 = stations[i + 1];
    
    if (station1) {
      groups.push({
        id: `group-${i}`,
        stationNumbers: [
          station1.number,
          station2?.number || ''
        ],
        // Клиенты пока демо
        clients: [`Клиент ${i+1}`, `Клиент ${i+2}`]
      });
    }
  }
  
  return groups;
}

/**
 * Группирует станции для Page1 (Full Body 1, 2, 3...)
 */
// training-data.js - исправленная функция
export function groupStationsForPage1(stations, trainingInfo = null) {
  // Для Page1: 3 программы по 2 клиента (всего 6 клиентов)
  const programs = [];
  const totalPrograms = 3;
  const clientsPerProgram = 2; // ТОЛЬКО 2 КЛИЕНТА НА ПРОГРАММУ
  
  // Создаем 3 программы
  for (let programIndex = 0; programIndex < totalPrograms; programIndex++) {
    // Распределяем станции по программам
    const stationsPerProgram = Math.ceil(stations.length / totalPrograms);
    const startIdx = programIndex * stationsPerProgram;
    const endIdx = Math.min(startIdx + stationsPerProgram, stations.length);
    const programStations = stations.slice(startIdx, endIdx);
    
    // Создаем 2 клиента для программы
    const stationGroups = [];
    for (let clientIndex = 0; clientIndex < clientsPerProgram; clientIndex++) {
      const globalClientNumber = programIndex * clientsPerProgram + clientIndex + 1;
      
      const station1 = programStations[clientIndex % programStations.length];
      const station2 = programStations[(clientIndex + 1) % programStations.length];
      
      stationGroups.push({
        station1: station1?.number || (clientIndex + 1).toString(),
        station2: station2?.number || (clientIndex + 2).toString(),
        clientName: `Клиент ${globalClientNumber}`
      });
    }
    
    // Название программы
    let programName;
    if (trainingInfo?.programName) {
      programName = `${trainingInfo.programName} ${programIndex + 1}`;
    } else {
      const demoNames = ['Arms & Shoulders', 'Legs & Core', 'Full Body Circuit'];
      programName = demoNames[programIndex] || `Program ${programIndex + 1}`;
    }
    
    programs.push({
      programName: programName,
      stations: stationGroups,
      totalClients: clientsPerProgram
    });
  }
  
  return programs;
}