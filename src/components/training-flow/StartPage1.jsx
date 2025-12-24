// src/components/training-flow/StartPage1.jsx
import { useState, useEffect } from 'react';
import { useTrainingState } from './useTrainingState';
import '../../pages/Page8.css';
import Logo from '../../assets/images/logo.svg';
import TimerIcon from '../../assets/images/timer.svg';


const StartPage1 = () => {
  const {
    timer,
    trainingConfig,
    currentStationIndex,
    currentApproach,
    getAllClients
  } = useTrainingState();
  
  console.log('🎬 StartPage1 рендер (13-24 клиентов):', { 
    timer, 
    stationIndex: currentStationIndex,
    approach: currentApproach 
  });
  
  const [clients, setClients] = useState([]);
  
  // Инициализация клиентов из данных
  useEffect(() => {
    const clientsData = getAllClients();
    console.log('✅ Клиенты из getAllClients:', clientsData);
    
    if (clientsData && clientsData.length > 0) {
      setClients(clientsData);
      console.log(`✅ Загружено ${clientsData.length} клиентов`);
    } else {
      // Fallback: тестовые данные для отладки (4 клиента на каждую колонку × 3 колонки = 12)
      console.log('⚠️ Нет данных клиентов, используем тестовые');
      const testClients = [];
      for (let i = 1; i <= 12; i++) {
        testClients.push({
          id: `${i}`,
          name: `Тестовый Клиент ${i}`,
          station: `${(i % 8) + 1}${String.fromCharCode(65 + (i % 3))}`
        });
      }
      setClients(testClients);
    }
  }, [getAllClients]);
  
  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Функция для распределения клиентов по 3 колонкам (для 13-24 клиентов)
  const distributeClientsToColumns = () => {
    if (clients.length === 0) {
      return { column1: [], column2: [], column3: [] };
    }
    
    const itemsPerColumn = Math.ceil(clients.length / 3);
    return {
      column1: clients.slice(0, itemsPerColumn),
      column2: clients.slice(itemsPerColumn, itemsPerColumn * 2),
      column3: clients.slice(itemsPerColumn * 2)
    };
  };
  
  const { column1, column2, column3 } = distributeClientsToColumns();
  
  // Функция для рендеринга клиентов в колонке
  const renderColumn = (columnClients) => {
    console.log('🔍 Рендерим колонку:', columnClients.length, 'клиентов');
    
    return columnClients.map((client, index) => {
      console.log(`👤 Клиент ${index}:`, client.name, client.station);
      
      const bgClass = index % 4;
      let frameClass;
      switch(bgClass) {
        case 0: frameClass = 'frame-54-nested-p8'; break;
        case 1: frameClass = 'frame-52-nested-p8'; break;
        case 2: frameClass = 'frame-37-nested-p8'; break;
        case 3: frameClass = 'frame-55-nested-p8'; break;
        default: frameClass = 'frame-54-nested-p8';
      }
      
      return (
        <div key={client.id} className={frameClass}>
          <div className="frame-46-p8">
            <div className="frame-58-p8">
              <div className="frame-10-p8">
                <div className="image-placeholder-p8"></div>
                <div className="text-marina-p8">
                  {client.name || `Клиент ${client.id}`}
                </div>
              </div>
              <div className="frame-26-p8">
                <div className="text-2d">{client.station || '--'}</div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };
  
  // Если клиентов нет, показываем заглушку
  if (clients.length === 0) {
    return (
      <div style={{
        height: '100vh',
        background: '#1F262F',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '20px'
      }}>
        Загрузка клиентов...
      </div>
    );
  }
  
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
            <div className="frame-52-p8">
              <div className="frame-14-p8">
                <div className="frame-54-inner-p8">
                  <div className="text-full-body-1-p8">
                    {trainingConfig?.name || 'Full Body 1'}
                  </div>
                </div>
              </div>
              <div className="frame-55-p8">
                <div className="frame-47-p8">
                  <div className="frame-38-inner-p8">
                    {renderColumn(column1)}
                  </div>
                  
                  <div className="frame-39-p8">
                    {renderColumn(column2)}
                  </div>
                  
                  <div className="frame-40-p8">
                    {renderColumn(column3)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-1-p8">
        <div className="frame-29-p8">
          <div className="text-transition-p8">
            Подход {currentApproach}
          </div>
        </div>
        
        <div className="frame-2-p8">
          <div className="frame-16-p8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`step-number-p8 ${
                  number === currentStationIndex + 1 ? 'current-p8' : 
                  number < currentStationIndex + 1 ? 'active-p8' : 
                  'inactive-p8'
                }`}
              >
                {number}
              </div>
            ))}
          </div>
          
          <div className="frame-18-p8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`progress-step-p8 ${
                  number === currentStationIndex + 1 ? 'current-p8' : 
                  number < currentStationIndex + 1 ? 'active-p8' : 
                  'inactive-p8'
                }`}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="frame-30-p8">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p8" />
          <div className="text-timer-p8">
            {formatTime(timer)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage1;