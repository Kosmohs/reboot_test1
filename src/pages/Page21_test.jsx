// src/pages/Page21_test.jsx
import './Page21_test.css';
import { useState } from 'react';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import Frame65Image1 from '../assets/images/frame65-image1.png'; 
import Frame65Image2 from '../assets/images/frame65-image2.png';

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
    <div className="page page-21-p21">
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
        
        {/* ВРЕМЕННЫЕ КНОПКИ ДЛЯ ТЕСТА (удали после проверки) */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          gap: '10px',
          zIndex: 1000,
          background: 'rgba(0,0,0,0.7)',
          padding: '10px',
          borderRadius: '8px'
        }}>
          <button 
            onClick={prevRound}
            disabled={currentRound === 1}
            style={{
              padding: '5px 10px', 
              background: currentRound === 1 ? '#ccc' : '#31A961', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: currentRound === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Раунд {currentRound - 1}
          </button>
          
          <button 
            onClick={nextRound}
            disabled={currentRound === totalRounds}
            style={{
              padding: '5px 10px', 
              background: currentRound === totalRounds ? '#ccc' : '#31A961', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: currentRound === totalRounds ? 'not-allowed' : 'pointer'
            }}
          >
            Раунд {currentRound + 1} →
          </button>
          
          <button 
            onClick={resetRounds}
            style={{
              padding: '5px 10px', 
              background: '#FF6600', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Сброс (Раунд 1)
          </button>
          
          <div style={{
            color: 'white', 
            padding: '5px 10px',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '14px'
          }}>
            Тест: Раунд <strong>{currentRound}</strong>/8
          </div>
        </div>
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