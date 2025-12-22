// src/pages/Page21.jsx
import './Page21.css'; // Исправлено
import { useState } from 'react';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import Frame65Image1 from '../assets/images/frame65-image1.png'; 
import Frame65Image2 from '../assets/images/frame65-image2.png'; 
// Frame65Image и Frame66Image не нужны для Page21

function Page21() {
  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 8;


  // Функции для тестирования
  const nextRound = () => {
    if (currentRound < totalRounds) {
      setCurrentRound(currentRound + 1);
    }
  };

  const prevRound = () => {
    if (currentRound > 1) {
      setCurrentRound(currentRound - 1);
    }
  };

  const resetRounds = () => {
    setCurrentRound(1);
  };

  // Функция для рендеринга блока упражнения
  const renderExerciseBlock = (id, labelA, labelB, imageSrc, clientName = "Клиент 1") => (
    <div key={id} className="frame-63-p21">
      {/* Картинка */}
      <img 
        src={imageSrc} 
        alt="Упражнение" 
        className="frame-63-image-p21"
      />
      
      {/* Frame 68 - блок с 2A | 2B */}
      <div className="frame-68-p21">
        <div className="text-2a-p21">{labelA}</div>
        <div className="line-1-p21"></div>
        <div className="text-2b-p21">{labelB}</div>
      </div>

      {/* Frame 74 - блок с двумя клиентами */}
      <div className="frame-74-p21">
        {/* Первый клиент */}
        <div className="frame-68-client-p21">
          <div className="frame-60-p21">
            <div className="client-avatar-p21"></div>
            <div className="client-text-p21">{clientName}</div>
          </div>
        </div>

        {/* Второй клиент */}
        <div className="frame-68-client-p21">
          <div className="frame-60-p21">
            <div className="client-avatar-p21"></div>
            <div className="client-text-p21">{clientName}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page page-21-p21"> {/* Исправлено */}
      {/* Frame 38 - верхний блок с логотипом */}
      <div className="frame-38-p21">
        <div className="logo-p21">
          <img src={Logo} alt="Логотип" className="logo-image-p21" />
        </div>
      </div>
      
      {/* Frame 65 - центральный блок с 2 упражнениями */}
      <div className="frame-65-p21">
        {/* Frame 63 */}
        {renderExerciseBlock("frame63", "2A", "2B", Frame65Image1)}
        
        {/* Frame 64 */}
        {renderExerciseBlock("frame64", "2C", "2D", Frame65Image2)}
      </div>

      {/* Frame 1 - нижняя панель */}
      <div className="frame-1-p21">
        {/* Frame29 - с текстом "Раунд 1/8" */}
        <div className="frame-29-p21">
          <div className="text-approach-1-p21">Раунд {currentRound}/{totalRounds}</div>
        </div>
        
        {/* Frame2 - по центру */}
        <div className="frame-2-p21">
          {/* Frame16 - верхняя часть с цифрами 1-8 */}
          <div className="frame-16-p21">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`step-number-p21 ${
                  // number <= 3 ? 'active-p21' : 
                  // number === currentRound ? 'active-p21' : 'current-p21'
                  number <= currentRound ? 'active-p21' : 'current-p21'
                }`}
              >
                {number}
              </div>
            ))}
          </div>
          
          {/* Frame18 - нижняя часть (прогресс бар) */}
          <div className="frame-18-p21">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`progress-step-p21 ${
                  // number <= 3 ? 'active-p21' : 
                  // number === currentRound ? 'active-p21' : 'inactive-p21'
                  number <= currentRound ? 'active-p21' : 'inactive-p21'
                }`}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Frame30 - справа */}
        <div className="frame-30-p21">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p21" />
          <div className="text-timer-p21">0:30</div>
        </div>
      </div>
    </div>
  );
}

export default Page21;