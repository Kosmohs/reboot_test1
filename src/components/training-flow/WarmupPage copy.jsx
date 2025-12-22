// src/components/training-flow/WarmupPage.jsx
import { useTrainingState } from './useTrainingState';
import './TrainingFlow.css'; // Создадим позже общие стили

const WarmupPage = () => {
  const {
    timer,
    trainingConfig,
    currentStep
  } = useTrainingState();
  
  console.log('🔥 WarmupPage рендер:', { timer, step: currentStep });
  
  // Форматирование времени (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="training-page warmup-page">
      <div className="page-header">
        <h1>РАЗМИНКА</h1>
        <div className="training-name">{trainingConfig.name}</div>
      </div>
      
      <div className="timer-section">
        <div className="timer-large">{formatTime(timer)}</div>
        <div className="timer-label">Осталось времени</div>
      </div>
      
      <div className="instructions">
        <h2>Подготовьтесь к тренировке</h2>
        <ul>
          <li>Выполните лёгкую кардио-разминку</li>
          <li>Разомните все суставы</li>
          <li>Сделайте динамическую растяжку</li>
          <li>Настройте дыхание</li>
        </ul>
      </div>
      
      <div className="progress-info">
        <div className="step-indicator">Этап 1 из 6</div>
        <div className="next-step-info">
          Далее: Переход к станциям ({trainingConfig.transition_time} сек)
        </div>
      </div>
    </div>
  );
};

export default WarmupPage;