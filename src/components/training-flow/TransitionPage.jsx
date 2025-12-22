// src/components/training-flow/TransitionPage.jsx
import { useState, useEffect } from 'react';
import { useTrainingState } from './useTrainingState';
import Logo from '../../assets/images/logo.svg';
import TimerIcon from '../../assets/images/timer.svg';
import ShuffleIcon from '../../assets/images/lucide_shuffle.svg';
import ArrowDouble from '../../assets/images/arrows.svg';
import '../../pages/Page7.css';

const TransitionPage = () => {
  const {
    timer,
    trainingConfig,
    currentStationIndex,
    getAllClients,
    getClientStations
  } = useTrainingState();
  
  console.log('🚶 TransitionPage рендер:', { 
    timer, 
    currentStationIndex,
    currentStationNumber: currentStationIndex + 1
  });
  
  const [clientsWithStations, setClientsWithStations] = useState([]);
  
  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Получаем данные клиентов для перехода
  useEffect(() => {
    console.log('🔍 Получение данных для перехода, currentStationIndex:', currentStationIndex);
    
    const allClients = getAllClients();
    console.log('👥 Все клиенты:', allClients.length, allClients);
    
    if (allClients.length > 0) {
      // Для теста создаём последовательность станций
      const stationSequence = ['1A', '2B', '3A', '4B', '5A', '6B', '7A', '8B'];
      
      const clientsData = allClients.map(client => {
        // Текущая станция (которую только что закончили)
        const fromStationIndex = currentStationIndex; // 0 для первой станции
        const toStationIndex = currentStationIndex + 1; // 1 для следующей станции
        
        const fromStation = stationSequence[fromStationIndex] || '1A';
        const toStation = stationSequence[toStationIndex] || '2B';
        
        console.log(`📍 ${client.name}: ${fromStation} → ${toStation}`);
        
        return {
          ...client,
          currentStation: fromStation,
          nextStation: toStation,
          hasTransition: true // Всегда показываем стрелку для теста
        };
      });
      
      console.log('✅ Клиенты с переходами:', clientsData);
      setClientsWithStations(clientsData);
    } else {
      // Тестовые данные
      console.log('⚠️ Нет клиентов, используем тестовые данные');
      const testClients = [
        { id: '1', name: 'Индира Мукыжанова', currentStation: '1A', nextStation: '2B', hasTransition: true },
        { id: '2', name: 'Татьяна Туркова', currentStation: '1A', nextStation: '2B', hasTransition: true },
        { id: '3', name: 'Тамилла Юрченко', currentStation: '1A', nextStation: '2B', hasTransition: true },
        { id: '4', name: 'Тестовый Клиент 4', currentStation: '1A', nextStation: '2B', hasTransition: true }
      ];
      setClientsWithStations(testClients);
    }
  }, [getAllClients, currentStationIndex]);
  
  // Логика прогресс-бара станций
  // currentStationIndex - индекс СЛЕДУЮЩЕЙ станции (к которой переходим)
  // Например: если currentStationIndex = 0, мы на станции 1, переходим на станцию 2
  
  const getStationStatus = (stationNumber) => {
    // stationNumber: 1-8
    // currentStationIndex: 0-7
    
    console.log(`📊 Проверка статуса станции ${stationNumber} при currentStationIndex=${currentStationIndex}`);
    
    // Если мы на ПЕРВОМ переходе (после станции 1):
    // currentStationIndex = 0 (прошли станцию 1, переходим на станцию 2)
    // Станция 1: active-p7 (зелёный - пройдена)
    // Станция 2: current-p7 (белый - переход на эту станцию)
    // Станция 3-8: inactive-p7 (серые)
    
    if (stationNumber < currentStationIndex + 1) {
      return 'active-p7'; // Уже пройденные станции
    } else if (stationNumber === currentStationIndex + 1) {
      return 'current-p7'; // Текущая станция (которую заканчиваем)
    } else {
      return 'inactive-p7'; // Будущие станции
    }
  };
  
  // Функция для распределения клиентов по колонкам
  const distributeClientsToColumns = () => {
    if (clientsWithStations.length <= 4) {
      return { leftColumn: clientsWithStations, rightColumn: [] };
    } else {
      const half = Math.ceil(clientsWithStations.length / 2);
      return {
        leftColumn: clientsWithStations.slice(0, half),
        rightColumn: clientsWithStations.slice(half)
      };
    }
  };
  
  const { leftColumn, rightColumn } = distributeClientsToColumns();
  
  // Функция для рендеринга клиентов в колонке
  const renderColumn = (columnClients) => {
    console.log('🔍 Рендерим колонку:', columnClients.length, 'клиентов');
    
    return columnClients.map((client, index) => {
      console.log(`👤 Рендерим ${client.name}: ${client.currentStation} → ${client.nextStation}`);
      
      const bgClass = index % 4;
      let frameClass;
      switch(bgClass) {
        case 0: frameClass = 'frame-54-nested-p7'; break;
        case 1: frameClass = 'frame-52-nested-p7'; break;
        case 2: frameClass = 'frame-37-nested-p7'; break;
        case 3: frameClass = 'frame-55-nested-p7'; break;
        default: frameClass = 'frame-54-nested-p7';
      }
      
      return (
        <div key={client.id} className={frameClass}>
          <div className="frame-46-p7">
            <div className="frame-58-p7">
              <div className="frame-10-p7">
                <div className="image-placeholder-p7"></div>
                <div className="text-marina-p7">{client.name}</div>
              </div>
              <div className="frame-26-p7">
                {/* Текущая станция (которую покидаем) */}
                <div className="text-2a-p7">{client.currentStation}</div>
                
                {/* Иконка стрелки */}
                {client.hasTransition && (
                  <div className="frame-45-p7">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p7" />
                  </div>
                )}
                
                {/* Следующая станция (куда идём) */}
                <div className="text-2d-p7">{client.nextStation}</div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };
  
  // Если клиентов нет, показываем заглушку
  if (clientsWithStations.length === 0) {
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
        Загрузка данных перехода...
      </div>
    );
  }
  
  return (
    <div className="page page-7-p7">
      <div className="frame-38-p7">
        <div className="logo-p7">
          <img src={Logo} alt="Логотип" className="logo-image-p7" />
        </div>
      </div>
      
      <div className="frame-37-p7">
        <div className="frame-28-p7">
          <div className="frame-27-p7">
            <div className="frame-52-p7">
              <div className="frame-14-p7">
                <div className="frame-54-inner-p7">
                  <div className="text-full-body-1-p7">
                    {trainingConfig?.name || 'Full Body 1'}
                  </div>
                </div>
              </div>
              <div className="frame-55-p7">
                <div className="frame-47-p7">
                  <div className="frame-38-inner-p7">
                    {renderColumn(leftColumn)}
                  </div>
                  
                  <div className="frame-40-p7">
                    {renderColumn(rightColumn)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-1-p7">
        <div className="frame-29-p7">
          <img src={ShuffleIcon} alt="Shuffle" className="shuffle-icon-p7" />
          <div className="text-transition-p7">Переход</div>
        </div>
        
        <div className="frame-2-p7">
          <div className="frame-16-p7">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
              const status = getStationStatus(number);
              console.log(`📊 Станция ${number}: ${status}`);
              return (
                <div key={number} className={`step-number-p7 ${status}`}>
                  {number}
                </div>
              );
            })}
          </div>
          
          <div className="frame-18-p7">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
              const status = getStationStatus(number);
              return <div key={number} className={`progress-step-p7 ${status}`}></div>;
            })}
          </div>
        </div>
        
        <div className="frame-30-p7">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p7" />
          <div className="text-timer-p7">{formatTime(timer)}</div>
        </div>
      </div>
    </div>
  );
};

export default TransitionPage;