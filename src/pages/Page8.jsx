// "ПЕРЕХОД 1х16"
import './Page8.css';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import ShuffleIcon from '../assets/images/lucide_shuffle.svg';
import ArrowDouble from '../assets/images/arrows.svg';

function Page8() {
  // Функция для рендеринга повторяющейся структуры данных
  const renderDataStructure = () => (
    <>
      <div className="frame-54-nested-p8">
        <div className="frame-46-p8">
          <div className="frame-58-p8">
            <div className="frame-10-p8">
              <div className="image-placeholder-p8"></div>
              <div className="text-marina-p8">Марина</div>
            </div>
            <div className="frame-26-p8">
                {/* Text 2A */}
                <div className="text-2a-p8">2A</div>
                
                {/* Frame45 - иконка стрелки */}
                <div className="frame-45-p8">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p8" />
                </div>
                
                {/* Text 2D */}
                <div className="text-2d-p8">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-52-nested-p8">
        <div className="frame-46-p8">
          <div className="frame-58-p8">
            <div className="frame-10-p8">
              <div className="image-placeholder-p8"></div>
              <div className="text-marina-p8">Марина</div>
            </div>
            <div className="frame-26-p8">
                {/* Text 2A */}
                <div className="text-2a-p8">2A</div>
                
                {/* Frame45 - иконка стрелки */}
                <div className="frame-45-p8">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p8" />
                </div>
                
                {/* Text 2D */}
                <div className="text-2d-p8">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-37-nested-p8">
        <div className="frame-46-p8">
          <div className="frame-58-p8">
            <div className="frame-10-p8">
              <div className="image-placeholder-p8"></div>
              <div className="text-marina-p8">Марина</div>
            </div>
            <div className="frame-26-p8">
                {/* Text 2A */}
                <div className="text-2a-p8">2A</div>
                
                {/* Frame45 - иконка стрелки */}
                <div className="frame-45-p8">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p8" />
                </div>
                
                {/* Text 2D */}
                <div className="text-2d-p8">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-55-nested-p8">
        <div className="frame-46-p8">
          <div className="frame-58-p8">
            <div className="frame-10-p8">
              <div className="image-placeholder-p8"></div>
              <div className="text-marina-p8">Марина</div>
            </div>
            <div className="frame-26-p8">
                {/* Text 2A */}
                <div className="text-2a-p8">2A</div>
                
                {/* Frame45 - иконка стрелки */}
                <div className="frame-45-p8">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p8" />
                </div>
                
                {/* Text 2D */}
                <div className="text-2d-p8">2D</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="page page-8-p8">
      <div className="frame-38-p8">
        <div className="logo-p8">
          <img src={Logo} alt="Логотип" className="logo-image-p8" />
        </div>
      </div>
      
      <div className="frame-37-p8">
        <div className="frame-28-p8">
            <div className="frame-27-p8">
                {/* Только один Frame52 */}
                <div className="frame-52-p8">
                <div className="frame-14-p8">
                    <div className="frame-54-inner-p8">
                    <div className="text-full-body-1-p8">Full Body 1</div>
                    </div>
                </div>
                <div className="frame-55-p8">
                    <div className="frame-47-p8">
                    {/* Три колонки вместо двух */}
                    <div className="frame-38-inner-p8">
                        {renderDataStructure()}
                    </div>
                    
                    <div className="frame-39-p8">
                        {renderDataStructure()}
                    </div>
                    
                    <div className="frame-40-p8">
                        {renderDataStructure()}
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
      </div>
      

        <div className="frame-1-p8">
            {/* Frame29 - с иконкой shuffle и текстом "Переход" */}
            <div className="frame-29-p8">
                <img src={ShuffleIcon} alt="Shuffle" className="shuffle-icon-p8" />
                <div className="text-transition-p8">Переход</div>
            </div>
            
            {/* Frame2 - по центру */}
            <div className="frame-2-p8">
                {/* Frame16 - верхняя часть с цифрами 1-8 */}
                <div className="frame-16-p8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <div 
                            key={number} 
                            className={`step-number-p8 ${
                                number <= 2 ? 'active-p8' : 
                                number === 3 ? 'current-p8' : 
                                'inactive-p8'
                            }`}
                        >
                        {number}
                        </div>
                    ))}
                </div>
                
                {/* Frame18 - нижняя часть (прогресс бар?) */}
                <div className="frame-18-p8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <div 
                            key={number} 
                            className={`progress-step-p8 ${
                                number <= 2 ? 'active-p8' : 
                                number === 3 ? 'current-p8' : 
                                'inactive-p8'
                            }`}
                        ></div>
                    ))}
                </div>
            </div>
            
            {/* Frame30 - справа */}
            <div className="frame-30-p8">
                {/* SVG иконка таймера */}
                <img src={TimerIcon} alt="Timer" className="timer-icon-p8" />
                
                {/* Текст времени */}
                <div className="text-timer-p8">2:00</div>
            </div>
        </div>
    </div>
  );
}

export default Page8;