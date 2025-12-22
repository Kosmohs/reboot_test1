// src/components/training-flow/RestPage.jsx
import { useTrainingState } from './useTrainingState';

const RestPage = () => {
  const {
    timer,
    trainingConfig,
    currentStep,
    currentStationIndex,
    currentApproach
  } = useTrainingState();
  
  console.log('🌿 RestPage рендер:', { 
    timer, 
    step: currentStep,
    station: currentStationIndex + 1,
    approach: currentApproach
  });
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="training-page rest-page">
      <div className="page-header">
        <h1>ОТДЫХ</h1>
        <div className="training-name">{trainingConfig.name}</div>
      </div>
      
      <div className="timer-section">
        <div className="timer-large">{formatTime(timer)}</div>
        <div className="timer-label">Время отдыха</div>
      </div>
      
      <div className="rest-info">
        <div className="approach-info">
          <h2>Подход {currentApproach} завершён</h2>
          <p>
            Осталось подходов: {trainingConfig.number_of_approaches - currentApproach}
          </p>
        </div>
        
        <div className="station-info">
          <h3>Станция {currentStationIndex + 1} из 8</h3>
          <p>
            Восстановите дыхание и подготовьтесь к следующему подходу
          </p>
        </div>
      </div>
      
      <div className="instructions">
        <h2>Восстановление</h2>
        <ul>
          <li>Сделайте несколько глубоких вдохов</li>
          <li>Восстановите пульс</li>
          <li>Попейте воды</li>
          <li>Подготовьтесь к следующему подходу</li>
        </ul>
      </div>
      
      <div className="progress-info">
        <div className="step-indicator">Этап 4 из 6</div>
        <div className="next-step-info">
          {currentApproach < trainingConfig.number_of_approaches ? (
            `Далее: Следующий подход (${trainingConfig.exercise_time} сек)`
          ) : currentStationIndex < 7 ? (
            `Далее: Переход к станции ${currentStationIndex + 2} (${trainingConfig.transition_time} сек)`
          ) : (
            'Далее: Завершение тренировки'
          )}
        </div>
      </div>
    </div>
  );
};

export default RestPage;