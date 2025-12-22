// src/components/training-flow/TransitionPage.jsx
import { useTrainingState } from './useTrainingState';

const TransitionPage = () => {
  const {
    timer,
    trainingConfig,
    currentStep,
    currentStationIndex,
    getCurrentStationForClient,
    getNextStationForClient
  } = useTrainingState();
  
  console.log('🚶 TransitionPage рендер:', { 
    timer, 
    step: currentStep,
    station: currentStationIndex + 1
  });
  
  // Пример для теста - в реальности будем получать клиентов из данных
  const testClientId = '0b3066b0-d4e2-11f0-92aa-005056015d0b';
  const currentStation = getCurrentStationForClient(testClientId);
  const nextStation = getNextStationForClient(testClientId);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="training-page transition-page">
      <div className="page-header">
        <h1>ПЕРЕХОД МЕЖДУ СТАНЦИЯМИ</h1>
        <div className="training-name">{trainingConfig.name}</div>
      </div>
      
      <div className="timer-section">
        <div className="timer-large">{formatTime(timer)}</div>
        <div className="timer-label">Время на переход</div>
      </div>
      
      <div className="transition-info">
        <div className="stations-comparison">
          {currentStation && nextStation ? (
            <>
              <div className="current-station-box">
                <h3>Текущая станция</h3>
                <div className="station-number">{currentStation.station}</div>
                <div className="station-name">{currentStation.training_name || 'Упражнение'}</div>
              </div>
              
              <div className="transition-arrow">→</div>
              
              <div className="next-station-box">
                <h3>Следующая станция</h3>
                <div className="station-number">{nextStation.station}</div>
                <div className="station-name">{nextStation.training_name || 'Упражнение'}</div>
              </div>
            </>
          ) : (
            <div className="no-stations-info">
              <h3>Переход к станции {currentStationIndex + 2}</h3>
              <p>Пожалуйста, перейдите к следующей станции</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="station-progress-section">
        <h3>Прогресс по станциям</h3>
        <div className="station-progress-bars">
          {Array.from({ length: 8 }).map((_, index) => (
            <div 
              key={index}
              className={`station-progress-bar ${index === currentStationIndex ? 'current' : index < currentStationIndex ? 'completed' : ''}`}
            >
              <div className="bar-number">{index + 1}</div>
              <div className="bar-fill"></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="instructions">
        <h2>Инструкция по переходу</h2>
        <ul>
          <li>Быстро перейдите к следующей станции</li>
          <li>Подготовьте оборудование</li>
          <li>Настройте тренажёр под себя</li>
          <li>Подождите сигнала тренера</li>
        </ul>
      </div>
      
      <div className="progress-info">
        <div className="step-indicator">Этап 5 из 6</div>
        <div className="next-step-info">
          Далее: Выполнение на станции {currentStationIndex + 2} ({trainingConfig.exercise_time} сек)
        </div>
      </div>
    </div>
  );
};

export default TransitionPage;