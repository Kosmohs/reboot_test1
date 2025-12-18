// // "ПЕРЕХОД 1х8"
import './Page11.css';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import ShuffleIcon from '../assets/images/lucide_shuffle.svg';
import ArrowDouble from '../assets/images/arrows.svg';

function Page11() {
  // Функция для рендеринга повторяющейся структуры данных
  const renderDataStructure = () => (
    <>
      <div className="frame-54-nested-p11">
        <div className="frame-46-p11">
          <div className="frame-58-p11">
            <div className="frame-10-p11">
              <div className="image-placeholder-p11"></div>
              <div className="text-marina-p11">Марина</div>
            </div>
            <div className="frame-26-p11">
                <div className="text-2d">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-52-nested-p11">
        <div className="frame-46-p11">
          <div className="frame-58-p11">
            <div className="frame-10-p11">
              <div className="image-placeholder-p11"></div>
              <div className="text-marina-p11">Марина</div>
            </div>
            <div className="frame-26-p11">
                <div className="text-2d">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-37-nested-p11">
        <div className="frame-46-p11">
          <div className="frame-58-p11">
            <div className="frame-10-p11">
              <div className="image-placeholder-p11"></div>
              <div className="text-marina-p11">Марина</div>
            </div>
            <div className="frame-26-p11">
                <div className="text-2d">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-55-nested-p11">
        <div className="frame-46-p11">
          <div className="frame-58-p11">
            <div className="frame-10-p11">
              <div className="image-placeholder-p11"></div>
              <div className="text-marina-p11">Марина</div>
            </div>
            <div className="frame-26-p11">
                <div className="text-2d">2D</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="page page-7-p11">
      <div className="frame-38-p11">
        <div className="logo-p11">
          <img src={Logo} alt="Логотип" className="logo-image-p11" />
        </div>
      </div>
      
      <div className="frame-37-p11">
        <div className="frame-28-p11">
            <div className="frame-27-p11">
                {/* Только один Frame52 */}
                <div className="frame-52-p11">
                <div className="frame-14-p11">
                    <div className="frame-54-inner-p11">
                    <div className="text-full-body-1-p11">Full Body 1</div>
                    </div>
                </div>
                <div className="frame-55-p11">
                    <div className="frame-47-p11">
                    <div className="frame-38-inner-p11">
                        {renderDataStructure()}
                    </div>
                    
                    <div className="frame-40-p11">
                        {renderDataStructure()}
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
      </div>
      

        <div className="frame-1-p11">
            {/* Frame29 - с иконкой shuffle и текстом "Переход" */}
            <div className="frame-29-p11">
                <div className="text-approach-1-p11">Подход 1</div>
            </div>
            
            {/* Frame2 - по центру */}
            <div className="frame-2-p11">
                {/* Frame16 - верхняя часть с цифрами 1-8 */}
                <div className="frame-16-p11">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <div 
                            key={number} 
                            className={`step-number-p11 ${
                                number <= 2 ? 'active-p11' : 
                                number === 3 ? 'current-p11' : 
                                'inactive-p11'
                            }`}
                        >
                        {number}
                        </div>
                    ))}
                </div>
                
                {/* Frame18 - нижняя часть (прогресс бар?) */}
                <div className="frame-18-p11">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <div 
                            key={number} 
                            className={`progress-step-p11 ${
                                number <= 2 ? 'active-p11' : 
                                number === 3 ? 'current-p11' : 
                                'inactive-p11'
                            }`}
                        ></div>
                    ))}
                </div>
            </div>
            
            {/* Frame30 - справа */}
            <div className="frame-30-p11">
                {/* SVG иконка таймера */}
                <img src={TimerIcon} alt="Timer" className="timer-icon-p11" />
                
                {/* Текст времени */}
                <div className="text-timer-p11">2:00</div>
            </div>
        </div>
    </div>
  );
}

export default Page11;