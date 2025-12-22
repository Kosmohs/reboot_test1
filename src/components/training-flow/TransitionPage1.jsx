// src/components/training-flow/TransitionPage1.jsx
import { useState, useEffect } from 'react';
import { useTrainingState } from './useTrainingState';
import Logo from '../../assets/images/logo.svg';
import TimerIcon from '../../assets/images/timer.svg';
import ShuffleIcon from '../../assets/images/lucide_shuffle.svg';
import ArrowDouble from '../../assets/images/arrows.svg';
import '../../pages/Page8.css';

const TransitionPage1 = () => {
  const {
    timer,
    trainingConfig,
    currentStationIndex,
    getAllClients,
    getClientStations
  } = useTrainingState();
  
  console.log('🚶 TransitionPage1 (12-24 клиентов) рендер:', { 
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
    console.log('🔍 Получение данных для перехода для 12-24 клиентов');
    
    const allClients = getAllClients();
    console.log('👥 Все клиенты:', allClients.length, allClients);
    
    if (allClients.length > 0) {
      // Создаём последовательность станций для 12-24 клиентов
      // Предполагаем 8 станций A и 8 станций B (всего 16 станций)
      const stationSequence = [
        '1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A',
        '1B', '2B', '3B', '4B', '5B', '6B', '7B', '8B'
      ];
      
      const clientsData = allClients.slice(0, 24).map((client, index) => {
        // Распределяем клиентов по станциям
        const fromStationIndex = (currentStationIndex + index) % stationSequence.length;
        const toStationIndex = (fromStationIndex + 1) % stationSequence.length;
        
        const fromStation = stationSequence[fromStationIndex] || '1A';
        const toStation = stationSequence[toStationIndex] || '2A';
        
        console.log(`📍 ${client.name} [${index}]: ${fromStation} → ${toStation}`);
        
        return {
          ...client,
          order: index,
          currentStation: fromStation,
          nextStation: toStation,
          hasTransition: true
        };
      });
      
      console.log(`✅ ${clientsData.length} клиентов с переходами`);
      setClientsWithStations(clientsData);
    } else {
      // Тестовые данные для 12-24 клиентов
      console.log('⚠️ Нет клиентов, используем тестовые данные (16 клиентов)');
      const testNames = [
        'Марина', 'Анна', 'Елена', 'Ольга', 'Ирина', 'Наталья', 
        'Татьяна', 'Светлана', 'Юлия', 'Мария', 'Александра', 'Екатерина',
        'Виктория', 'Дарья', 'Алиса', 'София'
      ];
      
      const testClients = testNames.map((name, index) => ({
        id: `test-${index + 1}`,
        name: `${name} ${index + 1}`,
        order: index,
        currentStation: index < 8 ? `${index + 1}A` : `${index - 7}B`,
        nextStation: (index + 1) < 8 ? `${index + 2}A` : 
                     (index + 1) === 8 ? '1B' : 
                     `${index - 6}B`,
        hasTransition: true
      }));
      
      setClientsWithStations(testClients);
    }
  }, [getAllClients, currentStationIndex]);
  
  // Логика прогресс-бара станций для 12-24 клиентов
  const getStationStatus = (stationNumber) => {
    // stationNumber: 1-8 (отображаем только основные 8 станций)
    // currentStationIndex: 0-15 (16 станций всего)
    
    const displayStation = stationNumber; // 1-8
    
    if (displayStation < Math.floor(currentStationIndex / 2) + 1) {
      return 'active-p8'; // Уже пройденные станции
    } else if (displayStation === Math.floor(currentStationIndex / 2) + 1) {
      return 'current-p8'; // Текущая станция
    } else {
      return 'inactive-p8'; // Будущие станции
    }
  };
  
  // Функция для распределения клиентов по 3 колонкам
  const distributeClientsToColumns = () => {
    if (clientsWithStations.length === 0) {
      return { col1: [], col2: [], col3: [] };
    }
    
    const total = clientsWithStations.length;
    const perColumn = Math.ceil(total / 3);
    
    return {
      col1: clientsWithStations.slice(0, perColumn),
      col2: clientsWithStations.slice(perColumn, perColumn * 2),
      col3: clientsWithStations.slice(perColumn * 2)
    };
  };
  
  const { col1, col2, col3 } = distributeClientsToColumns();
  
  // Функция для рендеринга клиентов в колонке
  const renderColumn = (columnClients, columnIndex) => {
    console.log(`🔍 Рендерим колонку ${columnIndex}:`, columnClients.length, 'клиентов');
    
    return columnClients.map((client, index) => {
      const bgClass = (columnIndex * 8 + index) % 4;
      let frameClass;
      switch(bgClass) {
        case 0: frameClass = 'frame-54-nested-p8'; break;
        case 1: frameClass = 'frame-52-nested-p8'; break;
        case 2: frameClass = 'frame-37-nested-p8'; break;
        case 3: frameClass = 'frame-55-nested-p8'; break;
        default: frameClass = 'frame-54-nested-p8';
      }
      
      return (
        <div key={`${client.id}-${index}`} className={frameClass}>
          <div className="frame-46-p8">
            <div className="frame-58-p8">
              <div className="frame-10-p8">
                <div className="image-placeholder-p8"></div>
                <div className="text-marina-p8">{client.name}</div>
              </div>
              <div className="frame-26-p8">
                {/* Текущая станция */}
                <div className="text-2a-p8">{client.currentStation}</div>
                
                {/* Иконка стрелки */}
                {client.hasTransition && (
                  <div className="frame-45-p8">
                    <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p8" />
                  </div>
                )}
                
                {/* Следующая станция */}
                <div className="text-2d-p8">{client.nextStation}</div>
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
        Загрузка данных перехода для 12-24 клиентов...
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
                  {/* Три колонки вместо двух */}
                  <div className="frame-38-inner-p8">
                    {renderColumn(col1, 1)}
                  </div>
                  
                  <div className="frame-39-p8">
                    {renderColumn(col2, 2)}
                  </div>
                  
                  <div className="frame-40-p8">
                    {renderColumn(col3, 3)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-1-p8">
        <div className="frame-29-p8">
          <img src={ShuffleIcon} alt="Shuffle" className="shuffle-icon-p8" />
          <div className="text-transition-p8">Переход</div>
        </div>
        
        <div className="frame-2-p8">
          <div className="frame-16-p8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
              const status = getStationStatus(number);
              console.log(`📊 Станция ${number}: ${status}`);
              return (
                <div key={number} className={`step-number-p8 ${status}`}>
                  {number}
                </div>
              );
            })}
          </div>
          
          <div className="frame-18-p8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
              const status = getStationStatus(number);
              return <div key={number} className={`progress-step-p8 ${status}`}></div>;
            })}
          </div>
        </div>
        
        <div className="frame-30-p8">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p8" />
          <div className="text-timer-p8">{formatTime(timer)}</div>
        </div>
      </div>
    </div>
  );
};

export default TransitionPage1;