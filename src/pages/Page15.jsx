// src/pages/Page14.jsx
import './Page15.css';
import { useState } from 'react';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import Frame63Image from '../assets/images/frame63-image.png'; 
import Frame64Image from '../assets/images/frame64-image.png'; 
import Frame65Image from '../assets/images/frame65-image.png'; 
import Frame66Image from '../assets/images/frame66-image.png'; 

function Page15() {
  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 8;

  // Функция для рендеринга элементов списка (только 2D)
  const renderListItem = (key) => (
    <div key={key} className="frame-54-p15">
      <div className="frame-46-p15">
        <div className="frame-58-p15">
          <div className="frame-10-p15">
            <div className="image-placeholder-p15"></div>
            <div className="text-name-p15">Марина</div>
          </div>
          <div className="frame-26-p15">
            {/* Только 2D без стрелки */}
            <div className="text-2d-p15">2D</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Функция для рендеринга блока упражнения
  // Функция для рендеринга блока упражнения
  const renderExerciseBlock = (id, labelA, labelB, imageSrc, clientName = "Клиент 1") => (
    <div key={id} className="frame-63-inner-p15">
      {/* Картинка (Frame 63) */}
      <img 
        src={imageSrc} 
        alt="Упражнение" 
        className="frame-63-image-p15"
      />
      
      {/* Frame 68 - блок с 2A | 2B */}
      <div className="frame-68-p15">
        <div className="text-2a-p15">{labelA}</div>
        <div className="line-1-p15"></div>
        <div className="text-2b-p15">{labelB}</div>
      </div>

      {/* Frame 74 - блок с двумя клиентами */}
      <div className="frame-74-p15">
        {/* Первый клиент */}
        <div className="frame-68-client-p15">
          <div className="frame-60-p15">
            <div className="client-avatar-p15"></div>
            <div className="client-text-p15">{clientName}</div>
          </div>
        </div>

        {/* Второй клиент */}
        <div className="frame-68-client-p15">
          <div className="frame-60-p15">
            <div className="client-avatar-p15"></div>
            <div className="client-text-p15">{clientName}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page page-14-p15">
      {/* Frame 38 - верхний блок с логотипом */}
      <div className="frame-38-p15">
        <div className="logo-p15">
          <img src={Logo} alt="Логотип" className="logo-image-p15" />
        </div>
      </div>
      
      {/* Frame 65 - центральный блок с 4 упражнениями */}
      <div className="frame-65-p15">
        {/* Frame 63 */}
        {renderExerciseBlock("frame63", "2A", "2B", Frame63Image)}
        
        {/* Frame 64 */}
        {renderExerciseBlock("frame64", "2C", "2D", Frame64Image)}
        
        {/* Frame 65 */}
        {renderExerciseBlock("frame65", "2E", "2F", Frame65Image)}
        
        {/* Frame 66 */}
        {renderExerciseBlock("frame66", "2G", "2H", Frame66Image)}
      </div>

      {/* Frame 1 - нижняя панель */}
      <div className="frame-1-p15">
        {/* Frame29 - с текстом "Раунд 1/8" */}
        <div className="frame-29-p15">
          <div className="text-approach-1-p15">Раунд {currentRound}/{totalRounds}</div>
        </div>
        
        {/* Frame2 - по центру */}
        <div className="frame-2-p15">
          {/* Frame16 - верхняя часть с цифрами 1-8 */}
          <div className="frame-16-p15">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`step-number-p15 ${
                  number <= 3 ? 'active-p15' : 
                  number === currentRound ? 'active-p15' : 'current-p15'
                }`}
              >
                {number}
              </div>
            ))}
          </div>
          
          {/* Frame18 - нижняя часть (прогресс бар) */}
          <div className="frame-18-p15">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`progress-step-p15 ${
                  number <= 3 ? 'active-p15' : 
                  number === currentRound ? 'active-p15' : 'inactive-p15'
                }`}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Frame30 - справа */}
        <div className="frame-30-p15">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p15" />
          <div className="text-timer-p15">0:30</div>
        </div>
      </div>
    </div>
  );
}

export default Page15;