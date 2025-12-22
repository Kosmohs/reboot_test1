// src/components/training-flow/TestComponent.jsx
import { useTrainingState } from './TrainingStateProvider';

const TestComponent = () => {
  const {
    currentStep,
    currentStationIndex,
    currentApproach,
    timer,
    isRunning,
    trainingConfig,
    goToNextStep,
    pauseTraining,
    resumeTraining
  } = useTrainingState();
  
  const stepNames = {
    1: 'Разминка',
    2: 'Начало',
    3: 'Выполнение',
    4: 'Отдых',
    5: 'Переход',
    6: 'Окончание'
  };
  
  return (
    <div style={{ padding: '20px', background: '#f5f5f5' }}>
      <h2>Тест TrainingStateProvider</h2>
      <div>
        <strong>Текущий этап:</strong> {stepNames[currentStep]} ({currentStep})
      </div>
      <div>
        <strong>Станция:</strong> {currentStationIndex + 1}/8
      </div>
      <div>
        <strong>Подход:</strong> {currentApproach}/{trainingConfig.number_of_approaches}
      </div>
      <div>
        <strong>Таймер:</strong> {timer} сек
      </div>
      <div>
        <strong>Статус:</strong> {isRunning ? '▶️ Идёт' : '⏸️ Пауза'}
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={goToNextStep}>Следующий шаг</button>
        <button onClick={pauseTraining}>Пауза</button>
        <button onClick={resumeTraining}>Продолжить</button>
      </div>
    </div>
  );
};

export default TestComponent;