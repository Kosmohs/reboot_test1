// src/pages/Page3.jsx
import './Page4.css';
import VectorBg from '../assets/images/execution-vector.svg';
import { useState } from 'react';

function Page4() {
  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 4;

  return (
    <div className="page page-4">
      {/* Vector - декоративный SVG фон */}
      <img src={VectorBg} alt="" className="vector-bg-p4" />
      
      {/* Frame 14 - центральная плашка (НАД цифрой) */}
      <div className="frame-14-p4">
        {/* Frame 1 - верхняя часть */}
        <div className="frame-1-p4">
          {/* Text "Раунд 1/8" - слева */}
          {/* <div className="text-round-p4">Раунд 1/8</div> */}
          <div className="text-round-p4">Раунд {currentRound}/{totalRounds}</div>
          
          {/* Frame 13 - справа */}
          <div className="frame-13-p4">
            {/* Text "08:41" */}
            <div className="text-time-p4">08:41</div>
          </div>
        </div>
        
        {/* Frame 3 - нижняя часть с границей */}
        <div className="frame-3-p4">
          {/* Frame 16 - цифры 1-4 */}
          <div className="frame-16-p4">
            {[1, 2, 3, 4].map((number) => (
              <div 
                key={number}
                className={`step-number-p4 ${
                  number === currentRound ? 'step-number-p4--active' : ''
                }`}
              >
                {number}
              </div>
            ))}
          </div>
          
          {/* Frame 18 - прогресс-бар? */}
          <div className="frame-18-p4">
            {[1, 2, 3, 4].map((number) => (
              <div 
                key={number}
                className={`progress-step-p4 ${
                  number === currentRound ? 'progress-step-p4--active' : ''
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Основная цифра 30 (ПОД плашкой) */}
      <div className="main-number-p4">30</div>
      
      {/* Frame 15 - нижняя панель */}
      <div className="frame-15-p4">
        {/* Frame 29 - кнопка "Отдых" */}
        <div className="frame-29-p4">
          <div className="text-approach-p4">Отдых</div>
        </div>
      </div>
    </div>
  );
}

export default Page4;