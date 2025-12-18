// src/pages/Page2.jsx
import './Page2.css';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import ShuffleIcon from '../assets/images/lucide_shuffle.svg';
import ArrowDouble from '../assets/images/arrows.svg';

function Page2() {
  // Функция для рендеринга повторяющейся структуры данных
  const renderDataStructure = () => (
    <>
      <div className="frame-54-nested-p2">
        <div className="frame-46-p2">
          <div className="frame-58-p2">
            <div className="frame-10-p2">
              <div className="image-placeholder-p2"></div>
              <div className="text-marina-p2">Марина</div>
            </div>
            <div className="frame-26-p2">
                {/* Text 2A */}
                <div className="text-2a-p2">2A</div>
                
                {/* Frame45 - иконка стрелки */}
                <div className="frame-45-p2">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p2" />
                </div>
                
                {/* Text 2D */}
                <div className="text-2d-p2">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-52-nested-p2">
        <div className="frame-46-p2">
          <div className="frame-58-p2">
            <div className="frame-10-p2">
              <div className="image-placeholder-p2"></div>
              <div className="text-marina-p2">Марина</div>
            </div>
            <div className="frame-26-p2">
                {/* Text 2A */}
                <div className="text-2a-p2">2A</div>
                
                {/* Frame45 - иконка стрелки */}
                <div className="frame-45-p2">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p2" />
                </div>
                
                {/* Text 2D */}
                <div className="text-2d-p2">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-37-nested-p2">
        <div className="frame-46-p2">
          <div className="frame-58-p2">
            <div className="frame-10-p2">
              <div className="image-placeholder-p2"></div>
              <div className="text-marina-p2">Марина</div>
            </div>
            <div className="frame-26-p2">
                {/* Text 2A */}
                <div className="text-2a-p2">2A</div>
                
                {/* Frame45 - иконка стрелки */}
                <div className="frame-45-p2">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p2" />
                </div>
                
                {/* Text 2D */}
                <div className="text-2d-p2">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-55-nested-p2">
        <div className="frame-46-p2">
          <div className="frame-58-p2">
            <div className="frame-10-p2">
              <div className="image-placeholder-p2"></div>
              <div className="text-marina-p2">Марина</div>
            </div>
            <div className="frame-26-p2">
                {/* Text 2A */}
                <div className="text-2a-p2">2A</div>
                
                {/* Frame45 - иконка стрелки */}
                <div className="frame-45-p2">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p2" />
                </div>
                
                {/* Text 2D */}
                <div className="text-2d-p2">2D</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="page page-2-p2">
      <div className="frame-38-p2">
        <div className="logo-p2">
          <img src={Logo} alt="Логотип" className="logo-image-p2" />
        </div>
      </div>
      
      <div className="frame-37-p2">
        <div className="frame-28-p2">
            <div className="frame-27-p2">
                {/* Frame52 */}
                <div className="frame-52-p2">
                <div className="frame-14-p2">
                    <div className="frame-54-inner-p2">
                    <div className="text-full-body-1-p2">Full Body 1</div>
                    </div>
                </div>
                <div className="frame-55-p2">
                    <div className="frame-47-p2">
                    <div className="frame-38-inner-p2">
                        {renderDataStructure()}
                    </div>
                    
                    <div className="frame-40-p2">
                        {renderDataStructure()}
                    </div>
                    </div>
                </div>
                </div>
                
                {/* Frame53 */}
                <div className="frame-53-p2">
                <div className="frame-14-p2">
                    <div className="frame-54-inner-p2">
                    <div className="text-full-body-2-p2">Full Body 2</div>
                    </div>
                </div>
                <div className="frame-55-p2">
                    <div className="frame-47-p2">
                    <div className="frame-38-inner-p2">
                        {renderDataStructure()}
                    </div>
                    
                    <div className="frame-40-p2">
                        {renderDataStructure()}
                    </div>
                    </div>
                </div>
                </div>
                
                {/* Frame54 */}
                <div className="frame-54-p2">
                <div className="frame-14-p2">
                    <div className="frame-54-inner-p2">
                    <div className="text-full-body-3-p2">Full Body 3</div>
                    </div>
                </div>
                <div className="frame-55-p2">
                    <div className="frame-47-p2">
                    <div className="frame-38-inner-p2">
                        {renderDataStructure()}
                    </div>
                    
                    <div className="frame-40-p2">
                        {renderDataStructure()}
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
      </div>
      

        <div className="frame-1-p2">
            {/* Frame29 - с иконкой shuffle и текстом "Переход" */}
            <div className="frame-29-p2">
                <img src={ShuffleIcon} alt="Shuffle" className="shuffle-icon-p2" />
                <div className="text-transition-p2">Переход</div>
            </div>
            
            {/* Frame2 - по центру */}
            <div className="frame-2-p2">
                {/* Frame16 - верхняя часть с цифрами 1-8 */}
                <div className="frame-16-p2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <div 
                            key={number} 
                            className={`step-number-p2 ${
                                number <= 2 ? 'active-p2' : 
                                number === 3 ? 'current-p2' : 
                                'inactive-p2'
                            }`}
                        >
                        {number}
                        </div>
                    ))}
                </div>
                
                {/* Frame18 - нижняя часть (прогресс бар?) */}
                <div className="frame-18-p2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <div 
                            key={number} 
                            className={`progress-step-p2 ${
                                number <= 2 ? 'active-p2' : 
                                number === 3 ? 'current-p2' : 
                                'inactive-p2'
                            }`}
                        ></div>
                    ))}
                </div>
            </div>
            
            {/* Frame30 - справа */}
            <div className="frame-30-p2">
                {/* SVG иконка таймера */}
                <img src={TimerIcon} alt="Timer" className="timer-icon-p2" />
                
                {/* Текст времени */}
                <div className="text-timer-p2">2:00</div>
            </div>
        </div>
    </div>
  );
}

export default Page2;