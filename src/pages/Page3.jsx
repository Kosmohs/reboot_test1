// src/pages/Page3.jsx
import './Page3.css';
import VectorBg from '../assets/images/execution-vector.svg';

function Page3() {
  return (
    <div className="page page-3">
      {/* Vector - декоративный SVG фон */}
      <img src={VectorBg} alt="" className="vector-bg-p3" />
      
      {/* Frame 14 - центральная плашка (НАД цифрой) */}
      <div className="frame-14-p3">
        {/* Frame 1 - верхняя часть */}
        <div className="frame-1-p3">
          {/* Text "Раунд 1/8" - слева */}
          <div className="text-round-p3">Раунд 1/8</div>
          
          {/* Frame 13 - справа */}
          <div className="frame-13-p3">
            {/* Text "08:41" */}
            <div className="text-time-p3">08:41</div>
          </div>
        </div>
        
        {/* Frame 3 - нижняя часть с границей */}
        <div className="frame-3-p3">
          {/* Frame 16 - цифры 1-4 */}
          <div className="frame-16-p3">
            <div className="step-number-p3 step-number-p3--active">1</div>
            <div className="step-number-p3">2</div>
            <div className="step-number-p3">3</div>
            <div className="step-number-p3">4</div>
          </div>
          
          {/* Frame 18 - прогресс-бар? */}
          <div className="frame-18-p3">
            <div className="progress-step-p3 progress-step-p3--active"></div>
            <div className="progress-step-p3"></div>
            <div className="progress-step-p3"></div>
            <div className="progress-step-p3"></div>
          </div>
        </div>
      </div>
      
      {/* Основная цифра 30 (ПОД плашкой) */}
      <div className="main-number-p3">30</div>
      
      {/* Frame 15 - нижняя панель */}
      <div className="frame-15-p3">
        {/* Frame 29 - кнопка "Подход 1" */}
        <div className="frame-29-p3">
          <div className="text-approach-p3">Подход 1</div>
        </div>
      </div>
    </div>
  );
}

export default Page3;