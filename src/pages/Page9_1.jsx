// src/pages/Page2.jsx
import './Page9_1.css';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import ShuffleIcon from '../assets/images/lucide_shuffle.svg';
import ArrowDouble from '../assets/images/arrows.svg';

function Page9_1() {
  // Функция для рендеринга повторяющейся структуры данных
  const renderDataStructure = () => (
    <>
      <div className="frame-54-nested-p9-1">
        <div className="frame-46-p9-1">
          <div className="frame-58-p9-1">
            <div className="frame-10-p9-1">
              <div className="image-placeholder-p9-1"></div>
              <div className="text-marina-p9-1">Марина</div>
            </div>
            <div className="frame-26-p9-1">
                <div className="text-2d">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-52-nested-p9-1">
        <div className="frame-46-p9-1">
          <div className="frame-58-p9-1">
            <div className="frame-10-p9-1">
              <div className="image-placeholder-p9-1"></div>
              <div className="text-marina-p9-1">Марина</div>
            </div>
            <div className="frame-26-p9-1">
                <div className="text-2d">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-37-nested-p9-1">
        <div className="frame-46-p9-1">
          <div className="frame-58-p9-1">
            <div className="frame-10-p9-1">
              <div className="image-placeholder-p9-1"></div>
              <div className="text-marina-p9-1">Марина</div>
            </div>
            <div className="frame-26-p9-1">
                <div className="text-2d">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-55-nested-p9-1">
        <div className="frame-46-p9-1">
          <div className="frame-58-p9-1">
            <div className="frame-10-p9-1">
              <div className="image-placeholder-p9-1"></div>
              <div className="text-marina-p9-1">Марина</div>
            </div>
            <div className="frame-26-p9-1">
                <div className="text-2d">2D</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="page page-2-p9-1">
      <div className="frame-38-p9-1">
        <div className="logo-p9-1">
          <img src={Logo} alt="Логотип" className="logo-image-p9-1" />
        </div>
      </div>
      
      <div className="frame-37-p9-1">
        <div className="frame-28-p9-1">
            <div className="frame-27-p9-1">
                {/* Frame52 */}
                <div className="frame-52-p9-1">
                <div className="frame-14-p9-1">
                    <div className="frame-54-inner-p9-1">
                    <div className="text-full-body-1-p9-1">Full Body 1</div>
                    </div>
                </div>
                <div className="frame-55-p9-1">
                    <div className="frame-47-p9-1">
                    <div className="frame-38-inner-p9-1">
                        {renderDataStructure()}
                    </div>
                    
                    <div className="frame-40-p9-1">
                        {renderDataStructure()}
                    </div>
                    </div>
                </div>
                </div>
                
                {/* Frame53 */}
                <div className="frame-53-p9-1">
                <div className="frame-14-p9-1">
                    <div className="frame-54-inner-p9-1">
                    <div className="text-full-body-2-p9-1">Full Body 2</div>
                    </div>
                </div>
                <div className="frame-55-p9-1">
                    <div className="frame-47-p9-1">
                    <div className="frame-38-inner-p9-1">
                        {renderDataStructure()}
                    </div>
                    
                    <div className="frame-40-p9-1">
                        {renderDataStructure()}
                    </div>
                    </div>
                </div>
                </div>
                
                {/* Frame54 */}
                <div className="frame-54-p9-1">
                <div className="frame-14-p9-1">
                    <div className="frame-54-inner-p9-1">
                    <div className="text-full-body-3-p9-1">Full Body 3</div>
                    </div>
                </div>
                <div className="frame-55-p9-1">
                    <div className="frame-47-p9-1">
                    <div className="frame-38-inner-p9-1">
                        {renderDataStructure()}
                    </div>
                    
                    <div className="frame-40-p9-1">
                        {renderDataStructure()}
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
      </div>
      

        <div className="frame-1-p9-1">
            {/* Frame29 - с иконкой shuffle и текстом "Переход" */}
            <div className="frame-29-p9-1">
                <div className="text-approach-1-p10">Подход 1</div>
            </div>
            
            {/* Frame2 - по центру */}
            <div className="frame-2-p9-1">
                {/* Frame16 - верхняя часть с цифрами 1-8 */}
                <div className="frame-16-p9-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <div 
                            key={number} 
                            className={`step-number-p9-1 ${
                                number <= 2 ? 'active-p9-1' : 
                                number === 3 ? 'current-p9-1' : 
                                'inactive-p9-1'
                            }`}
                        >
                        {number}
                        </div>
                    ))}
                </div>
                
                {/* Frame18 - нижняя часть (прогресс бар?) */}
                <div className="frame-18-p9-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <div 
                            key={number} 
                            className={`progress-step-p9-1 ${
                                number <= 2 ? 'active-p9-1' : 
                                number === 3 ? 'current-p9-1' : 
                                'inactive-p9-1'
                            }`}
                        ></div>
                    ))}
                </div>
            </div>
            
            {/* Frame30 - справа */}
            <div className="frame-30-p9-1">
                {/* SVG иконка таймера */}
                <img src={TimerIcon} alt="Timer" className="timer-icon-p9-1" />
                
                {/* Текст времени */}
                <div className="text-timer-p9-1">2:00</div>
            </div>
        </div>
    </div>
  );
}

export default Page9_1;