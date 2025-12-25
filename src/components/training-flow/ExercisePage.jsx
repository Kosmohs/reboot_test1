// src/components/training-flow/ExercisePage.jsx
import { useTrainingState } from './useTrainingState';
import VectorBg from '../../assets/images/execution-vector.svg';
// Используем существующий Page3.css
import '../../pages/Page3.css';

const ExercisePage = () => {
  const {
    timer,
    trainingConfig,
    currentStationIndex,
    currentApproach
  } = useTrainingState();
  
  // console.log('💪 ExercisePage рендер:', { 
  //   timer, 
  //   station: currentStationIndex + 1,
  //   approach: currentApproach 
  // });
  
  // Форматирование времени (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Форматирование секунд (только секунды для большой цифры)
  const formatSeconds = (seconds) => {
    return seconds;
  };
  
  return (
    <div className="page page-3">
      {/* Vector - декоративный SVG фон */}
      <img src={VectorBg} alt="" className="vector-bg-p3" />
      
      {/* Frame 14 - центральная плашка (НАД цифрой) */}
      <div className="frame-14-p3">
        {/* Frame 1 - верхняя часть */}
        <div className="frame-1-p3">
          {/* Text "Раунд 1/8" - слева */}
          <div className="text-round-p3">
            Round {currentStationIndex + 1}/8
          </div>
          
          {/* Frame 13 - справа */}
          <div className="frame-13-p3">
            {/* Text время */}
            {/* <div className="text-time-p3">{formatTime(timer)}</div> */}
          </div>
        </div>
        
        {/* Frame 3 - нижняя часть с границей */}
        <div className="frame-3-p3">
          {/* Frame 16 - цифры 1-4 (подходы) */}
          <div className="frame-16-p3">
            {[1, 2, 3, 4].map((number) => {
              const isActive = number <= currentApproach;
              const className = `step-number-p3 ${isActive ? 'step-number-p3--active' : ''}`;
              
              return (
                <div key={number} className={className}>
                  {number}
                </div>
              );
            })}
          </div>
          
          {/* Frame 18 - прогресс-бар подходов */}
          <div className="frame-18-p3">
            {[1, 2, 3, 4].map((number) => {
              const isActive = number <= currentApproach;
              const className = `progress-step-p3 ${isActive ? 'progress-step-p3--active' : ''}`;
              
              return (
                <div key={number} className={className}></div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Основная цифра секунд (ПОД плашкой) */}
      <div className="main-number-p3">{formatSeconds(timer)}</div>
      
      {/* Frame 15 - нижняя панель */}
      <div className="frame-15-p3">
        {/* Frame 29 - кнопка "Подход X" */}
        <div className="frame-29-p3">
          <div className="text-approach-p3">
            Подход {currentApproach}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;