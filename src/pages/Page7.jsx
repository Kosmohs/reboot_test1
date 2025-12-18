// // "ПЕРЕХОД 1х8"
import './Page7.css';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import ShuffleIcon from '../assets/images/lucide_shuffle.svg';
import ArrowDouble from '../assets/images/arrows.svg';

function Page7() {
  // Функция для рендеринга повторяющейся структуры данных
  const renderDataStructure = () => (
    <>
      <div className="frame-54-nested-p7">
        <div className="frame-46-p7">
          <div className="frame-58-p7">
            <div className="frame-10-p7">
              <div className="image-placeholder-p7"></div>
              <div className="text-marina-p7">Марина</div>
            </div>
            <div className="frame-26-p7">
                {/* Text 2A */}
                <div className="text-2a-p7">2A</div>
                
                {/* Frame45 - иконка стрелки */}
                <div className="frame-45-p7">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p7" />
                </div>
                
                {/* Text 2D */}
                <div className="text-2d-p7">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-52-nested-p7">
        <div className="frame-46-p7">
          <div className="frame-58-p7">
            <div className="frame-10-p7">
              <div className="image-placeholder-p7"></div>
              <div className="text-marina-p7">Марина</div>
            </div>
            <div className="frame-26-p7">
                {/* Text 2A */}
                <div className="text-2a-p7">2A</div>
                
                {/* Frame45 - иконка стрелки */}
                <div className="frame-45-p7">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p7" />
                </div>
                
                {/* Text 2D */}
                <div className="text-2d-p7">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-37-nested-p7">
        <div className="frame-46-p7">
          <div className="frame-58-p7">
            <div className="frame-10-p7">
              <div className="image-placeholder-p7"></div>
              <div className="text-marina-p7">Марина</div>
            </div>
            <div className="frame-26-p7">
                {/* Text 2A */}
                <div className="text-2a-p7">2A</div>
                
                {/* Frame45 - иконка стрелки */}
                <div className="frame-45-p7">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p7" />
                </div>
                
                {/* Text 2D */}
                <div className="text-2d-p7">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-55-nested-p7">
        <div className="frame-46-p7">
          <div className="frame-58-p7">
            <div className="frame-10-p7">
              <div className="image-placeholder-p7"></div>
              <div className="text-marina-p7">Марина</div>
            </div>
            <div className="frame-26-p7">
                {/* Text 2A */}
                <div className="text-2a-p7">2A</div>
                
                {/* Frame45 - иконка стрелки */}
                <div className="frame-45-p7">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p7" />
                </div>
                
                {/* Text 2D */}
                <div className="text-2d-p7">2D</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="page page-7-p7">
      <div className="frame-38-p7">
        <div className="logo-p7">
          <img src={Logo} alt="Логотип" className="logo-image-p7" />
        </div>
      </div>
      
      <div className="frame-37-p7">
        <div className="frame-28-p7">
            <div className="frame-27-p7">
                {/* Только один Frame52 */}
                <div className="frame-52-p7">
                <div className="frame-14-p7">
                    <div className="frame-54-inner-p7">
                    <div className="text-full-body-1-p7">Full Body 1</div>
                    </div>
                </div>
                <div className="frame-55-p7">
                    <div className="frame-47-p7">
                    <div className="frame-38-inner-p7">
                        {renderDataStructure()}
                    </div>
                    
                    <div className="frame-40-p7">
                        {renderDataStructure()}
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
      </div>
      

        <div className="frame-1-p7">
            {/* Frame29 - с иконкой shuffle и текстом "Переход" */}
            <div className="frame-29-p7">
                <img src={ShuffleIcon} alt="Shuffle" className="shuffle-icon-p7" />
                <div className="text-transition-p7">Переход</div>
            </div>
            
            {/* Frame2 - по центру */}
            <div className="frame-2-p7">
                {/* Frame16 - верхняя часть с цифрами 1-8 */}
                <div className="frame-16-p7">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <div 
                            key={number} 
                            className={`step-number-p7 ${
                                number <= 2 ? 'active-p7' : 
                                number === 3 ? 'current-p7' : 
                                'inactive-p7'
                            }`}
                        >
                        {number}
                        </div>
                    ))}
                </div>
                
                {/* Frame18 - нижняя часть (прогресс бар?) */}
                <div className="frame-18-p7">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <div 
                            key={number} 
                            className={`progress-step-p7 ${
                                number <= 2 ? 'active-p7' : 
                                number === 3 ? 'current-p7' : 
                                'inactive-p7'
                            }`}
                        ></div>
                    ))}
                </div>
            </div>
            
            {/* Frame30 - справа */}
            <div className="frame-30-p7">
                {/* SVG иконка таймера */}
                <img src={TimerIcon} alt="Timer" className="timer-icon-p7" />
                
                {/* Текст времени */}
                <div className="text-timer-p7">2:00</div>
            </div>
        </div>
    </div>
  );
}

export default Page7;