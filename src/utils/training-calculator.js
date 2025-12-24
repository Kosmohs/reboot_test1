// src/utils/training-calculator.js
/**
 * Утилита для расчета текущего состояния тренировки
 * (продолжение с текущего момента)
 */

/**
 * Рассчитывает текущее состояние тренировки на основе времени
 * @param {Object} trainingData - Данные тренировки из API/кэша
 * @param {Date} currentTime - Текущее время (по умолчанию сейчас)
 * @returns {Object} - Текущее состояние тренировки
 */
export function calculateCurrentTrainingState(trainingData, currentTime = new Date()) {
  console.log('🔄 calculateCurrentTrainingState ВХОД:', {
    trainingData: !!trainingData,
    currentTime: currentTime.toISOString(),
    hasTrainingInfo: !!trainingData?.trainingInfo,
    trainingName: trainingData?.trainingInfo?.name
  });

  if (!trainingData?.trainingInfo) {
    console.error('❌ Нет данных trainingInfo');
    return {
      status: 'idle',
      phase: 'idle',
      round: 1,
      timeLeft: 0,
      message: 'Нет данных о тренировке'
    };
  }

  const training = trainingData.trainingInfo;
  const startTime = new Date(training.time);
  const now = currentTime;

  console.log('📊 Временные данные:', {
    startTime: startTime.toISOString(),
    now: now.toISOString(),
    endTime: training.endTime ? new Date(training.endTime).toISOString() : 'нет',
    warmup_time: training.warmup_time,
    exercise_time: training.exercise_time,
    rest_time: training.rest_time,
    transition_time: training.transition_time,
    totalRounds: training.totalRounds
  });

  // 1. Если тренировка еще не началась
  if (now < startTime) {
    const timeUntilStart = Math.floor((startTime - now) / 1000); // секунды
    console.log(`⏰ Тренировка еще не началась. Через ${timeUntilStart} секунд`);
    
    return {
      status: 'not_started',
      phase: 'waiting',
      round: 0,
      timeLeft: timeUntilStart,
      elapsed: 0,
      message: `Тренировка начнется через ${Math.ceil(timeUntilStart / 60)} минут`
    };
  }

  // 2. Если есть endTime и тренировка уже закончилась
  if (training.endTime && now > new Date(training.endTime)) {
    console.log('🏁 Тренировка уже завершилась');
    return {
      status: 'finished',
      phase: 'finished',
      round: training.totalRounds,
      timeLeft: 0,
      elapsed: 0,
      message: 'Тренировка завершена'
    };
  }

  // 3. Тренировка идет сейчас - определяем фазу
  const elapsedSeconds = Math.floor((now - startTime) / 1000);
  console.log(`⏱️ Прошло ${elapsedSeconds} секунд с начала тренировки`);

  // Тайминги уже в секундах (как ты сказал)
  const warmupSec = training.warmup_time || 180; // дефолт 3 минуты
  const exerciseSec = training.exercise_time || 180; // дефолт 3 минуты
  const restSec = training.rest_time || 60; // дефолт 1 минута
  const transitionSec = training.transition_time || 30; // дефолт 30 секунд
  const totalRounds = training.totalRounds || 16;

  console.log('📏 Тайминги (секунды):', {
    warmupSec,
    exerciseSec,
    restSec,
    transitionSec,
    totalRounds
  });

  let totalElapsed = 0;

  // ПРОВЕРКА: РАЗМИНКА
  if (elapsedSeconds < warmupSec) {
    const timeLeft = warmupSec - elapsedSeconds;
    console.log(`🔥 РАЗМИНКА: осталось ${timeLeft} секунд`);
    
    return {
      status: 'current',
      phase: 'warmup',
      round: 1,
      timeLeft: timeLeft,
      elapsed: elapsedSeconds,
      totalDuration: warmupSec,
      message: `Разминка: ${Math.ceil(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
    };
  }

  totalElapsed += warmupSec;
  console.log(`📈 После разминки: totalElapsed = ${totalElapsed}`);

  // ПРОВЕРКА: РАУНДЫ (упражнения + отдых)
  for (let round = 1; round <= totalRounds; round++) {
    // 1. ФАЗА УПРАЖНЕНИЯ
    const exerciseStart = totalElapsed;
    const exerciseEnd = totalElapsed + exerciseSec;
    
    if (elapsedSeconds < exerciseEnd) {
      const timeLeft = exerciseEnd - elapsedSeconds;
      const inExerciseSeconds = elapsedSeconds - exerciseStart;
      
      console.log(`💪 УПРАЖНЕНИЕ Раунд ${round}/${totalRounds}: осталось ${timeLeft} секунд`);
      
      return {
        status: 'current',
        phase: 'exercise',
        round: round,
        timeLeft: timeLeft,
        elapsed: inExerciseSeconds,
        totalDuration: exerciseSec,
        message: `Раунд ${round}: Упражнение`
      };
    }
    
    totalElapsed += exerciseSec;
    
    // 2. ФАЗА ОТДЫХА (кроме последнего раунда)
    if (round < totalRounds) {
      const restStart = totalElapsed;
      const restEnd = totalElapsed + restSec;
      
      if (elapsedSeconds < restEnd) {
        const timeLeft = restEnd - elapsedSeconds;
        const inRestSeconds = elapsedSeconds - restStart;
        
        console.log(`☕ ОТДЫХ после раунда ${round}: осталось ${timeLeft} секунд`);
        
        return {
          status: 'current',
          phase: 'rest',
          round: round,
          timeLeft: timeLeft,
          elapsed: inRestSeconds,
          totalDuration: restSec,
          message: `Раунд ${round}: Отдых`
        };
      }
      
      totalElapsed += restSec;
    }
  }

  // 4. ФАЗА ПЕРЕХОДА (после всех раундов)
  const transitionStart = totalElapsed;
  
  // Если есть transition_time, используем его
  if (transitionSec > 0) {
    const transitionEnd = totalElapsed + transitionSec;
    
    if (elapsedSeconds < transitionEnd) {
      const timeLeft = transitionEnd - elapsedSeconds;
      console.log(`🔄 ПЕРЕХОД: осталось ${timeLeft} секунд`);
      
      return {
        status: 'current',
        phase: 'transition',
        round: totalRounds,
        timeLeft: timeLeft,
        elapsed: elapsedSeconds - transitionStart,
        totalDuration: transitionSec,
        message: 'Завершение тренировки'
      };
    }
    
    totalElapsed += transitionSec;
  }

  // 5. Если прошли все фазы, но тренировка еще не завершена по EndDate
  // (например, есть дополнительное время)
  console.log('✅ Все фазы тренировки пройдены');
  
  return {
    status: 'finished',
    phase: 'finished',
    round: totalRounds,
    timeLeft: 0,
    elapsed: elapsedSeconds,
    message: 'Тренировка завершена'
  };
}

/**
 * Рассчитывает общую продолжительность тренировки в секундах
 */
export function calculateTotalTrainingDuration(trainingInfo) {
  if (!trainingInfo) return 0;
  
  const warmup = trainingInfo.warmup_time || 180;
  const exercise = trainingInfo.exercise_time || 180;
  const rest = trainingInfo.rest_time || 60;
  const rounds = trainingInfo.totalRounds || 16;
  
  // Разминка + (раунды * упражнение) + ((раунды-1) * отдых)
  return warmup + (rounds * exercise) + ((rounds - 1) * rest);
}

/**
 * Форматирует секунды в MM:SS
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default {
  calculateCurrentTrainingState,
  calculateTotalTrainingDuration,
  formatTime
};