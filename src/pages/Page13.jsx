// src/pages/Page13.jsx
import './Page13.css';
// import React from 'react';
import { useState } from 'react';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import ArrowDouble from '../assets/images/arrows.svg';


function Page13() {
  
  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 8
  
  
  // Функция для рендеринга элементов списка
  const renderListItem = (key) => (
    <div key={key} className="frame-54-p13">
      <div className="frame-46-p13">
        <div className="frame-58-p13">
          <div className="frame-10-p13">
            <div className="image-placeholder-p13"></div>
            <div className="text-name-p13">Марина</div>
          </div>
          <div className="frame-26-p13">
            <div className="text-2a-p13">2A</div>
            <div className="frame-45-p13">
              <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p13" />
            </div>
            <div className="text-2d-p13">2D</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page page-13-p13">
      <div className="frame-38-p13">
        <div className="logo-p13">
          <img src={Logo} alt="Логотип" className="logo-image-p13" />
        </div>
      </div>
      
      <div className="frame-37-p13">
        <div className="frame-28-p13">
          <div className="frame-27-p13">
            {/* Только один Frame52 */}
            <div className="frame-52-p13">
              <div className="frame-14-p13">
                <div className="frame-54-inner-p13">
                  <div className="text-title-p13">Full Body 1</div>
                </div>
              </div>
              <div className="frame-47-p13">
                {/* Frame 38 - 7 элементов */}
                <div className="frame-38-p13-inner">
                  {[1, 2, 3, 4, 5, 6, 7].map(item => renderListItem(`38-${item}`))}
                </div>
                
                {/* Frame 40 - 7 элементов */}
                <div className="frame-40-p13">
                  {[1, 2, 3, 4, 5, 6, 7].map(item => renderListItem(`40-${item}`))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="frame-1-p13">
        {/* Frame29 - только текст "Подход 1" */}
        <div className="frame-29-p13">
          {/* <div className="text-approach-1-p13">Раунд {currentRound}/{totalRounds}</div> */}
            <div className="text-approach-1-p13">Раунд {currentRound}/{totalRounds}</div>

        </div>
        
        {/* Frame2 - по центру */}
        <div className="frame-2-p13">
          {/* Frame16 - верхняя часть с цифрами 1-8 */}
          <div className="frame-16-p13">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`step-number-p13 ${
                  number === 1 ? 'active-p13' : 'current-p13'
                }`}
              >
                {number}
              </div>
            ))}
          </div>
          
          {/* Frame18 - нижняя часть (прогресс бар) */}
          <div className="frame-18-p13">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`progress-step-p13 ${
                  number === 1 ? 'active-p13' : 'inactive-p13'
                }`}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Frame30 - справа */}
        <div className="frame-30-p13">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p13" />
          <div className="text-timer-p13">2:00</div>
        </div>
      </div>
    </div>
  );
}

export default Page13;