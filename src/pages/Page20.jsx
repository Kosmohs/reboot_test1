// src/pages/Page20.jsx
import './Page20.css';
import { useState } from 'react';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import ShuffleIcon from '../assets/images/lucide_shuffle.svg';
import Frame45Vector from '../assets/images/frame45-vector.svg';
import Frame30Vector from '../assets/images/frame30-vector.svg';

function Page20() {
  const [currentRound, setCurrentRound] = useState(3);
  const totalRounds = 8;

  // Функция для рендеринга блока Frame 30 (и 31, 32, 33)
  const renderFrame30 = (id, text = "1A", clientName = "Amtonio 1") => (
    <div key={id} className="frame-30-p20">
      {/* Vector - фоновая картинка */}
      <img 
        src={Frame30Vector} 
        alt="Фон" 
        className="frame-30-vector-p16" 
      />

      {/* Frame 70 */}
      <div className="frame-70-p20">
        {/* Frame 60 */}
        <div className="frame-60-p20">
          {/* Ellipse2 */}
          <div className="ellipse2-p20"></div>
          {/* Text Amtonio 1 */}
          <div className="client-name-p20">{clientName}</div>
        </div>
        
        {/* Text Переход на след станцию */}
        <div className="transition-text-p20">Переход на след станцию</div>
      </div>
      
      {/* Frame 45 */}
      <div className="frame-45-p20">
        <img 
          src={Frame45Vector} 
          alt="Стрелка" 
          className="frame-45-vector-p20" 
        />
      </div>
      
      {/* Text 1A */}
      <div className="text-1a-p20">{text}</div>
    </div>
  );

  return (
    <div className="page page-20-p20">
      {/* Frame 38 - верхний блок с логотипом */}
      <div className="frame-38-p20">
        <div className="logo-p20">
          <img src={Logo} alt="Логотип" className="logo-image-p20" />
        </div>
      </div>
      
      {/* Frame 65 - центральный блок */}
      <div className="frame-65-p20">
        {/* 4 элемента Frame 30, 31, 32, 33 */}
        {renderFrame30("frame30", "1A", "Amtonio 1")}
        {renderFrame30("frame31", "2B", "Amtonio 2")}
        {renderFrame30("frame32", "3C", "Amtonio 3")}
        {renderFrame30("frame33", "4D", "Amtonio 4")}
      </div>

      {/* Frame 1 - нижняя панель */}
      <div className="frame-1-p20">
        {/* Frame29 - с иконкой shuffle и текстом "Переход" */}
        <div className="frame-29-p20">
          <img src={ShuffleIcon} alt="Shuffle" className="shuffle-icon-p20" />
          <div className="text-transition-p20">Переход</div>
        </div>
        
        {/* Frame2 - по центру */}
        <div className="frame-2-p20">
          {/* Frame16 - верхняя часть с цифрами 1-8 */}
          <div className="frame-16-p20">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`step-number-p20 ${
                  // number <= 2 ? 'active-p20' : 
                  // number === 3 ? 'current-p20' :
                  // number === currentRound ? 'active-p20' : 'inactive-p20'
                  number < currentRound ? 'active-p20' : // Пройденные: зеленые
                  number === currentRound ? 'progress-current-p20' : // Текущий: белый
                  'inactive-p20' // Будущие: серые
                }`}
              >
                {number}
              </div>
            ))}
          </div>
          
          {/* Frame18 - нижняя часть (прогресс бар) */}
          <div className="frame-18-p20">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`progress-step-p20 ${
                  // number <= 2 ? 'active-p20' : 
                  // number === 3 ? 'progress-current-p20' :
                  // number === currentRound ? 'active-p20' : 'inactive-p20'
                  number < currentRound ? 'active-p20' : // Пройденные: зеленые
                  number === currentRound ? 'progress-current-p20' : // Текущий: белый
                  'inactive-p20' // Будущие: серые
                }`}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Frame30 - справа (таймер) */}
        <div className="frame-timer-p20">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p20" />
          <div className="text-timer-p20">2:00</div>
        </div>
      </div>
    </div>
  );
}

export default Page20;