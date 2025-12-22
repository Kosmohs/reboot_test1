// src/components/training-flow/StartPage.jsx
import { useState, useEffect } from 'react';
import { useTrainingState } from './useTrainingState';
import Logo from '../../assets/images/logo.svg';
import TimerIcon from '../../assets/images/timer.svg';
import '../../pages/Page1_1.css';

const StartPage = () => {
  const {
    timer,
    trainingConfig,
    currentStationIndex,
    currentApproach,
    getAllClients // ← ДОБАВЛЯЕМ
  } = useTrainingState();
  
  console.log('🎬 StartPage рендер:', { 
    timer, 
    stationIndex: currentStationIndex,
    approach: currentApproach 
  });
  
  const [clients, setClients] = useState([]);
  
  // Инициализация клиентов из данных
  useEffect(() => {
    const clientsData = getAllClients();
    console.log('✅ Клиенты из getAllClients:', clientsData);
    console.log('✅ Клиенты из данных:', clientsData);
    
    if (clientsData && clientsData.length > 0) {
      setClients(clientsData);
      console.log(`✅ Загружено ${clientsData.length} клиентов`);
    } else {
      // Fallback: тестовые данные
      console.log('⚠️ Нет данных клиентов, используем тестовые');
      const testClients = [
        { id: '1', name: 'Индира Мукыжанова', station: '1A' },
        { id: '2', name: 'Татьяна Туркова', station: '2A' },
        { id: '3', name: 'Тамилла Юрченко', station: '3A' },
        { id: '4', name: 'Тестовый Клиент 4', station: '4A' }
      ];
      setClients(testClients);
    }
  }, [getAllClients]);
  
  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Функция для распределения клиентов по колонкам
  const distributeClientsToColumns = () => {
    if (clients.length <= 4) {
      return { leftColumn: clients, rightColumn: [] };
    } else {
      const half = Math.ceil(clients.length / 2);
      return {
        leftColumn: clients.slice(0, half),
        rightColumn: clients.slice(half)
      };
    }
  };
  
  const { leftColumn, rightColumn } = distributeClientsToColumns();
  
  // Функция для рендеринга клиентов в колонке
  const renderColumn = (columnClients) => {
    console.log('🔍 Рендерим колонку:', columnClients.length, 'клиентов');
    
    return columnClients.map((client, index) => {
      console.log(`👤 Клиент ${index}:`, client.name, client.station);
      
      const bgClass = index % 4;
      let frameClass;
      switch(bgClass) {
        case 0: frameClass = 'frame-54-nested-p11'; break;
        case 1: frameClass = 'frame-52-nested-p11'; break;
        case 2: frameClass = 'frame-37-nested-p11'; break;
        case 3: frameClass = 'frame-55-nested-p11'; break;
        default: frameClass = 'frame-54-nested-p11';
      }
      
      return (
        <div key={client.id} className={frameClass}>
          <div className="frame-46-p11">
            <div className="frame-58-p11">
              <div className="frame-10-p11">
                <div className="image-placeholder-p11"></div>
                <div className="text-marina-p11">
                  {client.name || `Клиент ${index + 1}`}
                </div>
              </div>
              <div className="frame-26-p11">
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
                    {trainingConfig?.name || 'Steppe Burn'}
                  </div>
                </div>
              </div>
              <div className="frame-55-p11">
                <div className="frame-47-p11">
                  <div className="frame-38-inner-p11">
                    {renderColumn(leftColumn)}
                  </div>
                  
                  <div className="frame-40-p11">
                    {renderColumn(rightColumn)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-1-p11">
        <div className="frame-29-p11">
          <div className="text-approach-1-p11">
            Подход 1
          </div>
        </div>
        
        <div className="frame-2-p11">
          <div className="frame-16-p11">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
              let className = 'step-number-p11 ';
              if (number === currentStationIndex + 1) {
                className += 'current-p11';
              } else {
                className += 'inactive-p11';
              }
              
              return (
                <div key={number} className={className}>{number}</div>
              );
            })}
          </div>
          
          <div className="frame-18-p11">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
              let className = 'progress-step-p11 ';
              if (number === currentStationIndex + 1) {
                className += 'current-p11';
              } else {
                className += 'inactive-p11';
              }
              
              return <div key={number} className={className}></div>;
            })}
          </div>
        </div>
        
        <div className="frame-30-p11">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p11" />
          <div className="text-timer-p11">
            {formatTime(timer)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;