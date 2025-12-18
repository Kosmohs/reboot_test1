// src/pages/Page17.jsx
import './Page17.css';
import VectorBg from '../assets/images/execution-vector.svg';
import { useState } from 'react';

function Page17() {
  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 4;

  return (
    <div className="page page-4">
      {/* Vector - декоративный SVG фон */}
      <img src={VectorBg} alt="" className="vector-bg-p17" />
      
      {/* Frame 14 - центральная плашка (НАД цифрой) */}
      <div className="frame-14-p17">
        {/* Frame 1 - верхняя часть */}
        <div className="frame-1-p17">
          {/* Text "Раунд 1/8" - слева */}
          {/* <div className="text-round-p17">Раунд 1/8</div> */}
          <div className="text-round-p17">Раунд {currentRound}/{totalRounds}</div>
          
          {/* Frame 13 - справа */}
          <div className="frame-13-p17">
            {/* Text "08:41" */}
            <div className="text-time-p17">08:41</div>
          </div>
        </div>
        
        {/* Frame 3 - нижняя часть с границей */}
        <div className="frame-3-p17">
          {/* Frame 16 - цифры 1-4 (показываем 4 раунда за раз) */}
          <div className="frame-16-p17">
            {[1, 2, 3, 4].map((number) => (
              <div 
                key={number}
                className={`step-number-p17 ${
                  number === currentRound ? 'step-number-p17--active' : ''
                }`}
              >
                {number}
              </div>
            ))}
          </div>
          
          {/* Frame 18 - прогресс-бар? */}
          <div className="frame-18-p17">
            {[1, 2, 3, 4].map((number) => (
              <div 
                key={number}
                className={`progress-step-p17 ${
                  number === currentRound ? 'progress-step-p17--active' : ''
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Основная цифра 30 (ПОД плашкой) */}
      <div className="main-number-p17">30</div>
      
      {/* Frame 15 - нижняя панель */}
      <div className="frame-15-p17">
        {/* Frame 29 - кнопка "Отдых" */}
        <div className="frame-29-p17">
          <div className="text-approach-p17">Отдых</div>
        </div>
      </div>
    </div>
  );
}

export default Page17;