// src/pages/Page14.jsx
import './Page14.css';
import { useState } from 'react';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import Frame63Image from '../assets/images/frame63-image.png'; 
import Frame64Image from '../assets/images/frame64-image.png'; 
import Frame65Image from '../assets/images/frame65-image.png'; 
import Frame66Image from '../assets/images/frame66-image.png'; 

function Page14() {
  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 8;

  // Функция для рендеринга элементов списка (только 2D)
  const renderListItem = (key) => (
    <div key={key} className="frame-54-p14">
      <div className="frame-46-p14">
        <div className="frame-58-p14">
          <div className="frame-10-p14">
            <div className="image-placeholder-p14"></div>
            <div className="text-name-p14">Марина</div>
          </div>
          <div className="frame-26-p14">
            {/* Только 2D без стрелки */}
            <div className="text-2d-p14">2D</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Функция для рендеринга блока упражнения
  // Функция для рендеринга блока упражнения
  const renderExerciseBlock = (id, labelA, labelB, imageSrc, clientName = "Клиент 1") => (
    <div key={id} className="frame-63-inner-p14">
      {/* Картинка (Frame 63) */}
      <img 
        src={imageSrc} 
        alt="Упражнение" 
        className="frame-63-image-p14"
      />
      
      {/* Frame 68 - блок с 2A | 2B */}
      <div className="frame-68-p14">
        <div className="text-2a-p14">{labelA}</div>
        <div className="line-1-p14"></div>
        <div className="text-2b-p14">{labelB}</div>
      </div>

      {/* Frame 74 - блок с двумя клиентами */}
      <div className="frame-74-p14">
        {/* Первый клиент */}
        <div className="frame-68-client-p14">
          <div className="frame-60-p14">
            <div className="client-avatar-p14"></div>
            <div className="client-text-p14">{clientName}</div>
          </div>
        </div>

        {/* Второй клиент */}
        <div className="frame-68-client-p14">
          <div className="frame-60-p14">
            <div className="client-avatar-p14"></div>
            <div className="client-text-p14">{clientName}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page page-14-p14">
      {/* Frame 38 - верхний блок с логотипом */}
      <div className="frame-38-p14">
        <div className="logo-p14">
          <img src={Logo} alt="Логотип" className="logo-image-p14" />
        </div>
      </div>
      
      {/* Frame 65 - центральный блок с 4 упражнениями */}
      <div className="frame-65-p14">
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
      <div className="frame-1-p14">
        {/* Frame29 - с текстом "Раунд 1/8" */}
        <div className="frame-29-p14">
          <div className="text-approach-1-p14">Раунд {currentRound}/{totalRounds}</div>
        </div>
        
        {/* Frame2 - по центру */}
        <div className="frame-2-p14">
          {/* Frame16 - верхняя часть с цифрами 1-8 */}
          <div className="frame-16-p14">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`step-number-p14 ${
                  number === currentRound ? 'active-p14' : 'current-p14'
                }`}
              >
                {number}
              </div>
            ))}
          </div>
          
          {/* Frame18 - нижняя часть (прогресс бар) */}
          <div className="frame-18-p14">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`progress-step-p14 ${
                  number === currentRound ? 'active-p14' : 'inactive-p14'
                }`}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Frame30 - справа */}
        <div className="frame-30-p14">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p14" />
          <div className="text-timer-p14">0:30</div>
        </div>
      </div>
    </div>
  );
}

export default Page14;