// src/components/training-flow/FinishPage.jsx
import { useTrainingState } from './useTrainingState';

const FinishPage = () => {
  const {
    trainingConfig,
    currentStep
  } = useTrainingState();
  
  console.log('🏁 FinishPage рендер:', { step: currentStep });
  
  return (
    <div className="training-page finish-page">
      <div className="page-header">
        <h1>ТРЕНИРОВКА ЗАВЕРШЕНА</h1>
        <div className="training-name">{trainingConfig.name}</div>
      </div>
      
      <div className="finish-icon">
        <div className="checkmark">✓</div>
      </div>
      
      <div className="completion-info">
        <h2>Отличная работа!</h2>
        <p>Вы успешно завершили все 8 станций по 4 подхода</p>
        
        <div className="stats">
          <div className="stat-item">
            <div className="stat-number">8</div>
            <div className="stat-label">станций</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">32</div>
            <div className="stat-label">подхода</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">55</div>
            <div className="stat-label">минут</div>
          </div>
        </div>
      </div>
      
      <div className="cool-down-instructions">
        <h3>Заминка и восстановление</h3>
        <ul>
          <li>Выполните лёгкую растяжку</li>
          <li>Попейте воды</li>
          <li>Восстановите дыхание</li>
          <li>Поздравьте себя с завершением!</li>
        </ul>
      </div>
      
      <div className="final-message">
        <p>Спасибо за тренировку! До встречи в следующий раз.</p>
      </div>
    </div>
  );
};

export default FinishPage;