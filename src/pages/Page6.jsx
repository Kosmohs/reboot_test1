// // "ПЕРЕХОД 2х8"
import './Page6.css';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import ShuffleIcon from '../assets/images/lucide_shuffle.svg';
import ArrowDouble from '../assets/images/arrows.svg';

function Page6() {
  // Функция для рендеринга повторяющейся структуры данных
  const renderDataStructure = () => (
    <>
      <div className="frame-54-nested-p6">
        <div className="frame-46-p6">
          <div className="frame-58-p6">
            <div className="frame-10-p6">
              <div className="image-placeholder-p6"></div>
              <div className="text-marina-p6">Марина</div>
            </div>
            <div className="frame-26-p6">
                {/* Text 2A */}
                <div className="text-2a-p6">2A</div>
                
                {/* Frame45 - иконка стрелки */}
                <div className="frame-45-p6">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p6" />
                </div>
                
                {/* Text 2D */}
                <div className="text-2d-p6">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-52-nested-p6">
        <div className="frame-46-p6">
          <div className="frame-58-p6">
            <div className="frame-10-p6">
              <div className="image-placeholder-p6"></div>
              <div className="text-marina-p6">Марина</div>
            </div>
            <div className="frame-26-p6">
                {/* Text 2A */}
                <div className="text-2a-p6">2A</div>
                
                {/* Frame45 - иконка стрелки */}
                <div className="frame-45-p6">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p6" />
                </div>
                
                {/* Text 2D */}
                <div className="text-2d-p6">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-37-nested-p6">
        <div className="frame-46-p6">
          <div className="frame-58-p6">
            <div className="frame-10-p6">
              <div className="image-placeholder-p6"></div>
              <div className="text-marina-p6">Марина</div>
            </div>
            <div className="frame-26-p6">
                {/* Text 2A */}
                <div className="text-2a-p6">2A</div>
                
                {/* Frame45 - иконка стрелки */}
                <div className="frame-45-p6">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p6" />
                </div>
                
                {/* Text 2D */}
                <div className="text-2d-p6">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-55-nested-p6">
        <div className="frame-46-p6">
          <div className="frame-58-p6">
            <div className="frame-10-p6">
              <div className="image-placeholder-p6"></div>
              <div className="text-marina-p6">Марина</div>
            </div>
            <div className="frame-26-p6">
                {/* Text 2A */}
                <div className="text-2a-p6">2A</div>
                
                {/* Frame45 - иконка стрелки */}
                <div className="frame-45-p6">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p6" />
                </div>
                
                {/* Text 2D */}
                <div className="text-2d-p6">2D</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="page page-6-p6">
      <div className="frame-38-p6">
        <div className="logo-p6">
          <img src={Logo} alt="Логотип" className="logo-image-p6" />
        </div>
      </div>
      
      <div className="frame-37-p6">
        <div className="frame-28-p6">
            <div className="frame-27-p6">
                {/* Frame52 */}
                <div className="frame-52-p6">
                <div className="frame-14-p6">
                    <div className="frame-54-inner-p6">
                    <div className="text-full-body-1-p6">Full Body 1</div>
                    </div>
                </div>
                <div className="frame-55-p6">
                    <div className="frame-47-p6">
                    <div className="frame-38-inner-p6">
                        {renderDataStructure()}
                    </div>
                    
                    <div className="frame-40-p6">
                        {renderDataStructure()}
                    </div>
                    </div>
                </div>
                </div>
                
                {/* Frame53 */}
                <div className="frame-53-p6">
                <div className="frame-14-p6">
                    <div className="frame-54-inner-p6">
                    <div className="text-full-body-2-p6">Full Body 2</div>
                    </div>
                </div>
                <div className="frame-55-p6">
                    <div className="frame-47-p6">
                    <div className="frame-38-inner-p6">
                        {renderDataStructure()}
                    </div>
                    
                    <div className="frame-40-p6">
                        {renderDataStructure()}
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
      </div>
      

        <div className="frame-1-p6">
            {/* Frame29 - с иконкой shuffle и текстом "Переход" */}
            <div className="frame-29-p6">
                <img src={ShuffleIcon} alt="Shuffle" className="shuffle-icon-p6" />
                <div className="text-transition-p6">Переход</div>
            </div>
            
            {/* Frame2 - по центру */}
            <div className="frame-2-p6">
                {/* Frame16 - верхняя часть с цифрами 1-8 */}
                <div className="frame-16-p6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <div 
                            key={number} 
                            className={`step-number-p6 ${
                                number <= 2 ? 'active-p6' : 
                                number === 3 ? 'current-p6' : 
                                'inactive-p6'
                            }`}
                        >
                        {number}
                        </div>
                    ))}
                </div>
                
                {/* Frame18 - нижняя часть (прогресс бар?) */}
                <div className="frame-18-p6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <div 
                            key={number} 
                            className={`progress-step-p6 ${
                                number <= 2 ? 'active-p6' : 
                                number === 3 ? 'current-p6' : 
                                'inactive-p6'
                            }`}
                        ></div>
                    ))}
                </div>
            </div>
            
            {/* Frame30 - справа */}
            <div className="frame-30-p6">
                {/* SVG иконка таймера */}
                <img src={TimerIcon} alt="Timer" className="timer-icon-p6" />
                
                {/* Текст времени */}
                <div className="text-timer-p6">2:00</div>
            </div>
        </div>
    </div>
  );
}

export default Page6;