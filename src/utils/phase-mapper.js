// src/utils/phase-mapper.js
/**
 * Преобразует фазы из training-calculator в шаги TrainingStateProvider
 */
export function mapCalculatedPhaseToStep(calculatedState) {
    if (!calculatedState) return 2; // default: начало
    
    const { phase, round } = calculatedState;
    
    switch(phase) {
        case 'warmup':
            return 1; // Разминка
        case 'exercise':
            return 3; // Выполнение
        case 'rest':
            return 4; // Отдых
        case 'transition':
            return 5; // Переход
        case 'finished':
            return 6; // Окончание
        default:
            return 2; // Начало
    }
}

/**
 * Преобразует раунд из training-calculator в индекс станции
 * (Это зависит от твоей логики станций!)
 */
export function mapRoundToStationIndex(round, totalRounds = 16) {
    // Пример: 16 раундов = 8 станций по 2 раунда каждая
    // Или другая логика в зависимости от твоего Scheme
    if (round <= 0) return 0;
    
    // Простая логика: каждая станция = 2 раунда
    const stationIndex = Math.floor((round - 1) / 2);
    return Math.min(stationIndex, 7); // Не больше 7 станций
}

export default {
    mapCalculatedPhaseToStep,
    mapRoundToStationIndex
};