// src/pages/Page12.jsx
import './Page12.css';
import React from 'react';
import { useState } from 'react';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';

function Page12() {

  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 8
  
  // Функция для рендеринга элементов списка (только 2D)
  const renderListItem = (key) => (
    <div key={key} className="frame-54-p12">
      <div className="frame-46-p12">
        <div className="frame-58-p12">
          <div className="frame-10-p12">
            <div className="image-placeholder-p12"></div>
            <div className="text-name-p12">Марина</div>
          </div>
          <div className="frame-26-p12">
            {/* Только 2D без стрелки */}
            <div className="text-2d-p12">2D</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page page-12-p12">
      <div className="frame-38-p12">
        <div className="logo-p12">
          <img src={Logo} alt="Логотип" className="logo-image-p12" />
        </div>
      </div>
      
      <div className="frame-37-p12">
        <div className="frame-28-p12">
          <div className="frame-27-p12">
            {/* Только один Frame52 */}
            <div className="frame-52-p12">
              <div className="frame-14-p12">
                <div className="frame-54-inner-p12">
                  <div className="text-title-p12">Full Body 1</div>
                </div>
              </div>
              <div className="frame-47-p12">
                {/* Frame 38 - 7 элементов */}
                <div className="frame-38-p12-inner">
                  {[1, 2, 3, 4, 5, 6, 7].map(item => renderListItem(`38-${item}`))}
                </div>
                
                {/* Frame 40 - 7 элементов */}
                <div className="frame-40-p12">
                  {[1, 2, 3, 4, 5, 6, 7].map(item => renderListItem(`40-${item}`))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="frame-1-p12">
        {/* Frame29 - с текстом "Раунд 1/8" */}
        <div className="frame-29-p12">
          <div className="text-approach-1-p13">Раунд {currentRound}/{totalRounds}</div>
        </div>
        
        {/* Frame2 - по центру */}
        <div className="frame-2-p12">
          {/* Frame16 - верхняя часть с цифрами 1-8 */}
          <div className="frame-16-p12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`step-number-p12 ${
                  number === 1 ? 'active-p12' : 'current-p12'
                }`}
              >
                {number}
              </div>
            ))}
          </div>
          
          {/* Frame18 - нижняя часть (прогресс бар) */}
          <div className="frame-18-p12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`progress-step-p12 ${
                  number === 1 ? 'active-p12' : 'inactive-p12'
                }`}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Frame30 - справа */}
        <div className="frame-30-p12">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p12" />
          <div className="text-timer-p12">2:00</div>
        </div>
      </div>
    </div>
  );
}

export default Page12;