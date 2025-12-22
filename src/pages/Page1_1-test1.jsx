// page1_1.jsx - адаптирован для работы с API
import './Page11.css';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import { useEffect, useState } from 'react';

function Page11(props) {
  // Получаем данные через props или из глобального состояния
  const hitZoneData = props.hitZoneData || window.hitZoneData || {};
  
  const [trainingData, setTrainingData] = useState(null);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    console.log('Page1_1: Получены данные:', hitZoneData);
    
    // Обрабатываем данные из API
    if (hitZoneData.trainingInfo || hitZoneData.clients) {
      setTrainingData(hitZoneData.trainingInfo || {});
      
      // Формируем список клиентов
      if (hitZoneData.clients && hitZoneData.clients.length > 0) {
        // Берем только реальных клиентов, максимум 12
        const clientList = hitZoneData.clients.slice(0, 12).map((client, index) => ({
          id: client.ClientID || `client-${index}`,
          name: client.Name || `Клиент ${index + 1}`,
          // Станции: 1A, 1B, 1C, 1D, 2A, 2B, 2C, 2D, 3A, 3B, 3C, 3D
          station: `${Math.floor(index / 4) + 1}${String.fromCharCode(65 + (index % 4))}`,
        }));
        setClients(clientList);
      }
    } else {
      // Тестовые данные по умолчанию
      setTrainingData({
        name: 'Full Body 1',
        time: '16:00',
        trainer: 'Тренер Тест',
        round: 1,
        totalRounds: 16,
        currentApproach: 1,
        timer: '2:00'
      });
      
      // Тестовые клиенты (например, 6 клиентов)
      const testClients = Array.from({ length: 3 }, (_, index) => ({
        id: `test-${index + 1}`,
        name: ['Марина', 'Алексей', 'Светлана', 'Дмитрий', 'Ольга', 'Иван'][index] || `Клиент ${index + 1}`,
        station: `${Math.floor(index / 4) + 1}${String.fromCharCode(65 + (index % 4))}`,
      }));
      setClients(testClients);
    }
  }, [hitZoneData]);

  // Функция для рендеринга клиентов
  const renderClients = () => {
    // В page1_1 отображаем всех клиентов (1-12 человек)
    // Разделяем на 2 колонки
    const firstColumn = clients.slice(0, Math.min(6, Math.ceil(clients.length / 2)));
    const secondColumn = clients.slice(firstColumn.length);
    
    return (
      <>
        <div className="frame-38-inner-p11">
          {firstColumn.map((client, index) => (
            <div 
              key={client.id} 
              className={`frame-${index % 4 === 0 ? '54' : index % 4 === 1 ? '52' : index % 4 === 2 ? '37' : '55'}-nested-p11`}
            >
              <div className="frame-46-p11">
                <div className="frame-58-p11">
                  <div className="frame-10-p11">
                    <div className="image-placeholder-p11"></div>
                    <div className="text-marina-p11">{client.name}</div>
                  </div>
                  <div className="frame-26-p11">
                    <div className="text-2d">{client.station}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="frame-40-p11">
          {secondColumn.map((client, index) => (
            <div 
              key={client.id} 
              className={`frame-${index % 4 === 0 ? '54' : index % 4 === 1 ? '52' : index % 4 === 2 ? '37' : '55'}-nested-p11`}
            >
              <div className="frame-46-p11">
                <div className="frame-58-p11">
                  <div className="frame-10-p11">
                    <div className="image-placeholder-p11"></div>
                    <div className="text-marina-p11">{client.name}</div>
                  </div>
                  <div className="frame-26-p11">
                    <div className="text-2d">{client.station}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

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
            <div className="frame-52-p11">
              <div className="frame-14-p11">
                <div className="frame-54-inner-p11">
                  <div className="text-full-body-1-p11">
                    {trainingData?.name || 'Full Body 1'}
                  </div>
                </div>
              </div>
              <div className="frame-55-p11">
                <div className="frame-47-p11">
                  {renderClients()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="frame-1-p11">
        <div className="frame-29-p11">
          <div className="text-approach-1-p11">
            Подход {trainingData?.currentApproach || 1}
          </div>
        </div>
        
        <div className="frame-2-p11">
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
        
        <div className="frame-30-p11">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p11" />
          <div className="text-timer-p11">
            {trainingData?.timer || '2:00'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page11;