// src/components/training-flow/RestPage.jsx
import { useTrainingState } from './useTrainingState';
import VectorBg from '../../assets/images/execution-vector.svg';
// Используем существующий Page4.css
import '../../pages/Page4.css';

const RestPage = () => {
  const {
    timer,
    trainingConfig,
    currentStationIndex,
    currentApproach
  } = useTrainingState();
  
  // console.log('🌿 RestPage рендер:', { 
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
    <div className="page page-4">
      {/* Vector - декоративный SVG фон */}
      <img src={VectorBg} alt="" className="vector-bg-p4" />
      
      {/* Frame 14 - центральная плашка (НАД цифрой) */}
      <div className="frame-14-p4">
        {/* Frame 1 - верхняя часть */}
        <div className="frame-1-p4">
          {/* Text "Раунд 1/8" - слева */}
          <div className="text-round-p4">
            Round {currentStationIndex + 1}/8
          </div>
          
          {/* Frame 13 - справа */}
          <div className="frame-13-p4">
            {/* Text время
            <div className="text-time-p4">{formatTime(timer)}</div> */}
          </div>
        </div>
        
        {/* Frame 3 - нижняя часть с границей */}
        <div className="frame-3-p4">
          {/* Frame 16 - цифры 1-4 (подходы) */}
          <div className="frame-16-p4">
            {[1, 2, 3, 4].map((number) => {
              const isActive = number <= currentApproach;
              const className = `step-number-p4 ${isActive ? 'step-number-p4--active' : ''}`;
              
              return (
                <div key={number} className={className}>
                  {number}
                </div>
              );
            })}
          </div>
          
          {/* Frame 18 - прогресс-бар подходов */}
          <div className="frame-18-p4">
            {[1, 2, 3, 4].map((number) => {
              const isActive = number <= currentApproach;
              const className = `progress-step-p4 ${isActive ? 'progress-step-p4--active' : ''}`;
              
              return (
                <div key={number} className={className}></div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Основная цифра секунд (ПОД плашкой) */}
      <div className="main-number-p4">{formatSeconds(timer)}</div>
      
      {/* Frame 15 - нижняя панель */}
      <div className="frame-15-p4">
        {/* Frame 29 - кнопка "Отдых" */}
        <div className="frame-29-p4">
          <div className="text-approach-p4">Отдых</div>
        </div>
      </div>
    </div>
  );
};

export default RestPage;