// src/pages/Page18.jsx
import './Page18.css';
import HappyIcon from '../assets/images/tv20-happy.svg';
import VectorBg from '../assets/images/execution-vector.svg';

function Page18() {
  return (
    <div className="page page-5">
      {/* Vector - декоративный SVG фон */}
      <img src={VectorBg} alt="" className="vector-bg-p18" />
      
      {/* Иконка happy-fill */}
      <img src={HappyIcon} alt="Happy" className="happy-icon-p18" />
      
      {/* Текст благодарности */}
      <div className="thank-you-text-p18">Спасибо, Тренировка окончена</div>
    </div>
  );
}

export default Page18;