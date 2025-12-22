// src/components/training-flow/ExercisePage.jsx
import { useTrainingState } from './useTrainingState';

const ExercisePage = () => {
  const {
    timer,
    trainingConfig,
    currentStep,
    currentStationIndex,
    currentApproach
  } = useTrainingState();
  
  console.log('💪 ExercisePage рендер:', { 
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
  
  // Прогресс-бар для подходов (4 подхода)
  const renderApproachProgress = () => {
    const totalApproaches = trainingConfig.number_of_approaches;
    const approaches = [];
    
    for (let i = 1; i <= totalApproaches; i++) {
      approaches.push(
        <div 
          key={i}
          className={`approach-dot ${i <= currentApproach ? 'active' : ''}`}
        >
          {i}
        </div>
      );
    }
    
    return <div className="approach-progress">{approaches}</div>;
  };
  
  // Прогресс-бар для станций (8 станций)
  const renderStationProgress = () => {
    const stations = [];
    
    for (let i = 1; i <= 8; i++) {
      stations.push(
        <div 
          key={i}
          className={`station-step ${i === currentStationIndex + 1 ? 'current' : i < currentStationIndex + 1 ? 'completed' : ''}`}
        >
          {i}
        </div>
      );
    }
    
    return <div className="station-progress">{stations}</div>;
  };
  
  return (
    <div className="training-page exercise-page">
      <div className="page-header">
        <h1>ВЫПОЛНЕНИЕ УПРАЖНЕНИЯ</h1>
        <div className="training-name">{trainingConfig.name}</div>
      </div>
      
      <div className="timer-section">
        <div className="timer-large">{formatTime(timer)}</div>
        <div className="timer-label">Время упражнения</div>
      </div>
      
      <div className="exercise-info">
        <div className="approach-display">
          <h2>ПОДХОД {currentApproach}</h2>
          {renderApproachProgress()}
        </div>
        
        <div className="station-display">
          <h3>СТАНЦИЯ {currentStationIndex + 1} / 8</h3>
          {renderStationProgress()}
        </div>
      </div>
      
      <div className="instructions">
        <h2>Сосредоточьтесь на технике</h2>
        <ul>
          <li>Дышите равномерно</li>
          <li>Следите за правильной техникой</li>
          <li>Не торопитесь</li>
          <li>Контролируйте движения</li>
        </ul>
      </div>
      
      <div className="progress-info">
        <div className="step-indicator">Этап 3 из 6</div>
        <div className="next-step-info">
          Далее: Отдых ({trainingConfig.rest_time} сек)
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;