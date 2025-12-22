// src/components/training-flow/StartPage.jsx
import { useTrainingState } from './useTrainingState';

const StartPage = () => {
  const {
    timer,
    trainingConfig,
    currentStep,
    currentStationIndex,
    currentApproach
  } = useTrainingState();
  
  console.log('🎬 StartPage рендер:', { 
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
    <div className="training-page start-page">
      <div className="page-header">
        <h1>ПЕРЕХОД К СТАНЦИЯМ</h1>
        <div className="training-name">{trainingConfig.name}</div>
      </div>
      
      <div className="timer-section">
        <div className="timer-large">{formatTime(timer)}</div>
        <div className="timer-label">Время на переход</div>
      </div>
      
      <div className="instructions">
        <h2>Займите свои станции</h2>
        <p>
          Перейдите к своей первой станции и подготовьте оборудование.
          Тренер поможет вам настроить всё необходимое.
        </p>
      </div>
      
      <div className="station-info">
        <div className="current-station">
          Станция: <strong>{currentStationIndex + 1} из 8</strong>
        </div>
        <div className="approach-info">
          Первый подход из {trainingConfig.number_of_approaches}
        </div>
      </div>
      
      <div className="progress-info">
        <div className="step-indicator">Этап 2 из 6</div>
        <div className="next-step-info">
          Далее: Выполнение упражнения ({trainingConfig.exercise_time} сек)
        </div>
      </div>
    </div>
  );
};

export default StartPage;