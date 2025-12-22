// src/utils/simple-parser.js

/**
 * Простой парсер для текущих данных API
 * Только извлекаем станции для нашего телевизора
 */
export function getStationsForOurTV(apiData, ourTelevisorId = 4) {
  if (!apiData?.data?.length) return [];
  
  // Находим первую тренировку с нашим телевизором
  const training = apiData.data.find(t => 
    t.training?.trainings?.some(st => st.televisor_id == ourTelevisorId)
  );
  
  if (!training) return [];
  
  // Фильтруем станции нашего телевизора
  return training.training.trainings
    .filter(station => station.televisor_id == ourTelevisorId)
    .map((station, index) => ({
      id: station.id,
      stationId: station.station?.id,
      name: station.station?.name,
      number: station.station?.number, // "7", "6", "15", "13", "19", "18"
      exercise: station.training?.name,
      approaches: station.number_of_approaches || 4,
      video: station.training?.video
    }));
}

/**
 * Получаем информацию о тренировке
 */
export function getTrainingInfo(apiData) {
  if (!apiData?.data?.length) return null;
  
  const training = apiData.data[0]; // Пока берём первую
  
  return {
    programName: training.Service?.Title || 'Тренировка',
    trainer: training.Employee?.FullName || 'Тренер',
    startTime: training.StartDate,
    endTime: training.EndDate,
    duration: training.Duration || 55, // минут
    
    // Времена (условно, как договорились)
    exerciseTime: 60,    // секунд
    restTime: 45,       // секунд
    transitionTime: 30, // секунд
    warmupTime: 300,    // секунд (5 минут)
    cooldownTime: 300   // секунд (5 минут)
  };
}