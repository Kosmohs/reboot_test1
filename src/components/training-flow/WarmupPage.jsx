// src/components/training-flow/WarmupPage.jsx
import { useTrainingState } from './useTrainingState';
import Logo from '../../assets/images/logo.svg';
import TimerIcon from '../../assets/images/timer.svg';
import Frame63Image from '../../assets/images/frame63-razminka-image.png';
import '../../pages/Page23.css'; // ← Импортируем существующий CSS


const WarmupPage = () => {
  const {
    timer
  } = useTrainingState();
  
  // Форматирование времени (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="page page-23">
      {/* Frame 38 - верхний блок с логотипом */}
      <div className="frame-38-p23">
        <div className="logo-p23">
          <img src={Logo} alt="Логотип" className="logo-image-p23" />
        </div>
      </div>
      
      {/* Frame 65 - центральный блок с 1 упражнением */}
      <div className="frame-65-p23">
        {/* Frame 63 - единственный блок */}
        <div className="frame-63-p23">
          {/* Картинка */}
          <img 
            src={Frame63Image} 
            alt="Упражнение" 
            className="frame-63-image-p23"
          />
        </div>
      </div>

      {/* Frame 1 - нижняя панель */}
      <div className="frame-1-p23">
        {/* Frame29 - с текстом "Разминка" */}
        <div className="frame-29-p23">
          <div className="text-approach-1-p23">Разминка</div>
        </div>
        
        {/* Frame30 - справа с таймером */}
        <div className="frame-30-p23">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p23" />
          <div className="text-timer-p23">{formatTime(timer)}</div>
        </div>
      </div>
    </div>
  );
};

export default WarmupPage;