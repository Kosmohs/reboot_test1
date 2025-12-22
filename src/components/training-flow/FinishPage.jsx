// src/components/training-flow/FinishPage.jsx
import { useTrainingState } from './useTrainingState';
import HappyIcon from '../../assets/images/tv20-happy.svg';
import VectorBg from '../../assets/images/execution-vector.svg';
// Используем существующий Page5.css
import '../../pages/Page5.css';

const FinishPage = () => {
  const {
    trainingConfig
  } = useTrainingState();
  
  console.log('🏁 FinishPage рендер - Тренировка завершена!');
  
  return (
    <div className="page page-5">
      {/* Vector - декоративный SVG фон */}
      <img src={VectorBg} alt="" className="vector-bg-p5" />
      
      {/* Иконка happy-fill */}
      <img src={HappyIcon} alt="Happy" className="happy-icon-p5" />
      
      {/* Текст благодарности */}
      <div className="thank-you-text-p5">
        Спасибо, Тренировка окончена
      </div>
      
      {/* Дополнительная информация о завершённой тренировке
      <div className="training-summary-p5">
        <div className="summary-title-p5">
          {trainingConfig?.name || 'Тренировка'} успешно завершена!
        </div>
        <div className="summary-stats-p5">
          <div className="stat-item-p5">
            <div className="stat-number-p5">8</div>
            <div className="stat-label-p5">станций</div>
          </div>
          <div className="stat-item-p5">
            <div className="stat-number-p5">32</div>
            <div className="stat-label-p5">подхода</div>
          </div>
          <div className="stat-item-p5">
            <div className="stat-number-p5">55</div>
            <div className="stat-label-p5">минут</div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default FinishPage;