// src/pages/Page16.jsx
import './Page16.css';
import { useState } from 'react';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import ShuffleIcon from '../assets/images/lucide_shuffle.svg';
import Frame36Vector from '../assets/images/frame36-vector.svg';
import Frame45Vector from '../assets/images/frame45-vector.svg'; // Импортируем иконку для Frame 45

function Page16() {
  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 8;

  // Функция для рендеринга блока Frame 36 (и 35, 34, 33)
  const renderFrame36 = (id, text = "1A", clientName = "Клиент 1") => (
    <div key={id} className="frame-36-p16">
      {/* Vector - фоновая картинка */}
      <img 
        src={Frame36Vector} 
        alt="Фон" 
        className="frame-36-vector-p16" 
      />
      
      {/* Frame 70 */}
      <div className="frame-70-p16">
        {/* Ellipse2 - аватар */}
        <div className="ellipse2-p16"></div>
        
        {/* Frame 77 */}
        <div className="frame-77-p16">
          <div className="client-name-p16">{clientName}</div>
          <div className="transition-text-p16">Переход на след станцию</div>
        </div>
      </div>
      
      {/* Frame 45 */}
      <div className="frame-45-p16">
        {/* Vector иконка ">>" */}
        <img 
          src={Frame45Vector} 
          alt="Стрелка" 
          className="frame-45-vector-p16" 
        />
      </div>
      
      {/* Text 1A */}
      <div className="text-1a-p16">{text}</div>
    </div>
  );

  // Функция для рендеринга строки (Frame 75 или 76)
  const renderRow = (id, itemsCount = 4, startNumber = 1) => (
    <div key={id} className="frame-75-p16">
      {Array.from({ length: itemsCount }).map((_, index) => 
        renderFrame36(
          `${id}-${index}`, 
          `${startNumber + index}A`, 
          `Клиент ${startNumber + index}`
        )
      )}
    </div>
  );

  return (
    <div className="page page-16-p16">
      {/* Frame 38 - верхний блок с логотипом */}
      <div className="frame-38-p16">
        <div className="logo-p16">
          <img src={Logo} alt="Логотип" className="logo-image-p16" />
        </div>
      </div>
      
      {/* Frame 65 - центральный блок */}
      <div className="frame-65-p16">
        {/* Frame 75 (первая строка: 1A, 2A, 3A, 4A) */}
        {renderRow("row1", 4, 1)}
        
        {/* Frame 76 (вторая строка: 5A, 6A, 7A, 8A) */}
        {renderRow("row2", 4, 5)}
      </div>

      {/* Frame 1 - нижняя панель */}
      <div className="frame-1-p16">
        {/* Frame29 - с текстом "Раунд 1/8" */}
        <div className="frame-29-p16">
            <img src={ShuffleIcon} alt="Shuffle" className="shuffle-icon-p6" />
            <div className="text-transition-p16">Переход</div>
        </div>
        
        {/* Frame2 - по центру */}
        <div className="frame-2-p16">
          {/* Frame16 - верхняя часть с цифрами 1-8 */}
          <div className="frame-16-p16">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`step-number-p16 ${
                    number <= 2 ? 'active-p16' : 
                    number === 3 ? 'current-p16' :
                  number === currentRound ? 'active-p16' : 'inactive-p16'
                }`}
              >
                {number}
              </div>
            ))}
          </div>
          
          {/* Frame18 - нижняя часть (прогресс бар) */}
          <div className="frame-18-p16">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`progress-step-p16 ${
                    number <= 2 ? 'active-p16' : 
                    number === 3 ? 'progress-current-p16' :
                  number === currentRound ? 'active-p16' : 'inactive-p16'
                }`}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Frame30 - справа */}
        <div className="frame-30-p16">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p16" />
          <div className="text-timer-p16">2:00</div>
        </div>
      </div>
    </div>
  );
}

export default Page16;