// src/pages/Page1.jsx
import './Page1.css';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';


function Page1() {
  // Функция для рендеринга повторяющейся структуры данных
  const renderDataStructure = () => (
    <>
      <div className="frame-54-nested">
        <div className="frame-46">
          <div className="frame-58">
            <div className="frame-10">
              <div className="image-placeholder"></div>
              <div className="text-marina">Марина</div>
            </div>
            <div className="frame-26">
              <div className="text-2d">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-52-nested">
        <div className="frame-46">
          <div className="frame-58">
            <div className="frame-10">
              <div className="image-placeholder"></div>
              <div className="text-marina">Марина</div>
            </div>
            <div className="frame-26">
              <div className="text-2d">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-37-nested">
        <div className="frame-46">
          <div className="frame-58">
            <div className="frame-10">
              <div className="image-placeholder"></div>
              <div className="text-marina">Марина</div>
            </div>
            <div className="frame-26">
              <div className="text-2d">2D</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-55-nested">
        <div className="frame-46">
          <div className="frame-58">
            <div className="frame-10">
              <div className="image-placeholder"></div>
              <div className="text-marina">Марина</div>
            </div>
            <div className="frame-26">
              <div className="text-2d">2D</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="page page-1">
      <div className="frame-38">
        <div className="logo">
          <img src={Logo} alt="Логотип" className="logo-image" />
        </div>
      </div>
      
      <div className="frame-37">
        <div className="frame-28">
            <div className="frame-27">
                {/* Frame52 */}
                <div className="frame-52">
                <div className="frame-14">
                    <div className="frame-54-inner">
                    <div className="text-full-body-1">Full Body 1</div>
                    </div>
                </div>
                <div className="frame-55">
                    <div className="frame-47">
                    <div className="frame-38-inner">
                        {renderDataStructure()}
                    </div>
                    
                    <div className="frame-40">
                        {renderDataStructure()}
                    </div>
                    </div>
                </div>
                </div>
                
                {/* Frame53 */}
                <div className="frame-53">
                <div className="frame-14">
                    <div className="frame-54-inner">
                    <div className="text-full-body-2">Full Body 2</div>
                    </div>
                </div>
                <div className="frame-55">
                    <div className="frame-47">
                    <div className="frame-38-inner">
                        {renderDataStructure()}
                    </div>
                    
                    <div className="frame-40">
                        {renderDataStructure()}
                    </div>
                    </div>
                </div>
                </div>
                
                {/* Frame54 */}
                <div className="frame-54">
                <div className="frame-14">
                    <div className="frame-54-inner">
                    <div className="text-full-body-3">Full Body 3</div>
                    </div>
                </div>
                <div className="frame-55">
                    <div className="frame-47">
                    <div className="frame-38-inner">
                        {renderDataStructure()}
                    </div>
                    
                    <div className="frame-40">
                        {renderDataStructure()}
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
      </div>
      

        <div className="frame-1">
            {/* Frame29 - слева */}
            <div className="frame-29">
                <div className="text-approach-1">Подход 1</div>
            </div>
            
            {/* Frame2 - по центру */}
            <div className="frame-2">
                {/* Frame16 - верхняя часть с цифрами 1-8 */}
                <div className="frame-16">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <div 
                            key={number} 
                            className={`step-number ${number === 1 ? 'active' : ''}`}
                        >
                            {number}
                        </div>
                    ))}
                </div>
                
                {/* Frame18 - нижняя часть (прогресс бар?) */}
                <div className="frame-18">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <div 
                            key={number} 
                            className={`progress-step ${number === 1 ? 'active' : ''}`}
                        ></div>
                    ))}
                </div>
            </div>
            
            {/* Frame30 - справа */}
            <div className="frame-30">
                {/* SVG иконка таймера */}
                <img src={TimerIcon} alt="Timer" className="timer-icon" />
                
                {/* Текст времени */}
                <div className="text-timer">2:00</div>
            </div>
        </div>
    </div>
  );
}

export default Page1;