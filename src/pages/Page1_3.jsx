// "ПОДХОД" 2х8
// src/pages/Page10.jsx
import './Page10.css';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';

function Page10() {
  // Функция для рендеринга элементов левой колонки (5 элементов)
  const renderLeftColumnElements = (count) => (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={`frame-item-p10 ${index % 2 === 0 ? 'frame-54-nested-p10' : 'frame-52-nested-p10'}`}>
          <div className="frame-46-p10">
            <div className="frame-58-p10">
              <div className="frame-10-p10">
                <div className="image-placeholder-p10"></div>
                <div className="text-marina-p10">Марина</div>
              </div>
              <div className="frame-26-p10">
                <div className="text-2d">2D</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  // Функция для рендеринга элементов правой колонки (4 элемента)
  const renderRightColumnElements = (count) => (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={`frame-item-p10 ${index % 2 === 0 ? 'frame-54-nested-p10' : 'frame-52-nested-p10'}`}>
          <div className="frame-46-p10">
            <div className="frame-58-p10">
              <div className="frame-10-p10">
                <div className="image-placeholder-p10"></div>
                <div className="text-marina-p10">Марина</div>
              </div>
              <div className="frame-26-p10">
                <div className="text-2d">2D</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="page page-10-p10">
      <div className="frame-38-p10">
        <div className="logo-p10">
          <img src={Logo} alt="Логотип" className="logo-image-p10" />
        </div>
      </div>
      
      <div className="frame-37-p10">
        <div className="frame-28-p10">
            <div className="frame-27-p10">
                {/* Frame52 - ЛЕВАЯ колонка (Full Body 1) */}
                <div className="frame-52-p10">
                  <div className="frame-14-p10 green-bg-p10">
                    <div className="frame-54-inner-p10">
                      <div className="text-full-body-1-p10">Full Body 1</div>
                    </div>
                  </div>
                  <div className="frame-47-left-p10">
                    {/* Frame 38-inner - 5 элементов */}
                    <div className="frame-38-inner-p10">
                      {renderLeftColumnElements(5)}
                    </div>
                    
                    {/* Frame 40 - 3 элемента */}
                    <div className="frame-40-p10">
                      {renderLeftColumnElements(3)}
                    </div>
                  </div>
                </div>
                
                {/* Frame53 - ПРАВАЯ колонка (Full Body 2) */}
                <div className="frame-53-p10">
                  <div className="frame-14-p10 blue-bg-p10">
                    <div className="frame-54-inner-p10">
                      <div className="text-full-body-2-p10">Full Body 2</div>
                    </div>
                  </div>
                  <div className="frame-47-right-p10">
                    {/* Frame 38-inner - 4 элемента */}
                    <div className="frame-38-inner-p10">
                      {renderRightColumnElements(4)}
                    </div>
                    
                    {/* Frame 39-inner - 4 элемента */}
                    <div className="frame-39-inner-p10">
                      {renderRightColumnElements(4)}
                    </div>
                  </div>
                </div>
            </div>
        </div>
      </div>
      

        <div className="frame-1-p10">
            {/* Frame29 - только текст "Подход 1" (без иконки) */}
            <div className="frame-29-p10">
                <div className="text-approach-1-p10">Подход 1</div>
            </div>
            
            {/* Frame2 - по центру */}
            <div className="frame-2-p10">
                {/* Frame16 - верхняя часть с цифрами 1-8 */}
                <div className="frame-16-p10">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <div 
                            key={number} 
                            className={`step-number-p10 ${
                                number <= 2 ? 'active-p10' : 
                                number === 3 ? 'current-p10' : 
                                'inactive-p10'
                            }`}
                        >
                        {number}
                        </div>
                    ))}
                </div>
                
                {/* Frame18 - нижняя часть (прогресс бар?) */}
                <div className="frame-18-p10">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <div 
                            key={number} 
                            className={`progress-step-p10 ${
                                number <= 2 ? 'active-p10' : 
                                number === 3 ? 'current-p10' : 
                                'inactive-p10'
                            }`}
                        ></div>
                    ))}
                </div>
            </div>
            
            {/* Frame30 - справа */}
            <div className="frame-30-p10">
                {/* SVG иконка таймера */}
                <img src={TimerIcon} alt="Timer" className="timer-icon-p10" />
                
                {/* Текст времени */}
                <div className="text-timer-p10">2:00</div>
            </div>
        </div>
    </div>
  );
}

export default Page10;