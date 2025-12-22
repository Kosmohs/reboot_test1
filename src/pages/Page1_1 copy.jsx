// page1_1.jsx - адаптирован для работы с API
import './Page1_1.css';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import { useEffect, useState, useRef } from 'react';

console.log('🔴🔴🔴 THIS IS PAGE1_1.jsx 🔴🔴🔴');

function Page11(props) {
  const hitZoneData = props.hitZoneData || {};
  
  const [trainingData, setTrainingData] = useState(null);
  const [clients, setClients] = useState([]);
  const [currentTime, setCurrentTime] = useState(120); // 2:00 в секундах
  const [currentRound, setCurrentRound] = useState(1); // Текущий раунд
  const timerRef = useRef(null);

  // Таймер
  useEffect(() => {
    // Останавливаем предыдущий таймер
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (trainingData) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev <= 0) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [trainingData]); // Зависим только от trainingData

  useEffect(() => {
    console.log('Page1_1: Получены данные:', hitZoneData);
    
    // Проверяем, что данные есть и не пустые
    if (hitZoneData && Object.keys(hitZoneData).length > 0) {
      // Обрабатываем данные из API
      const training = hitZoneData.programData || {};
      
      // Формируем данные для отображения
      const trainingInfo = {
        name: training?.title || hitZoneData.trainingInfo?.name || 'Full Body 1',
        trainer: hitZoneData.trainingInfo?.trainer || 'Тренер',
        round: 1, // Начинаем с 1 раунда
        totalRounds: hitZoneData.trainingInfo?.totalRounds || 16,
        currentApproach: hitZoneData.trainingInfo?.currentApproach || 1,
      };
      
      setTrainingData(trainingInfo);
      
      // Обрабатываем клиентов из Scheme
      if (hitZoneData.Scheme && hitZoneData.Scheme.length > 0) {
        // Берем первый раунд для отображения начального состояния
        const firstRound = hitZoneData.Scheme[0];
        
        // Собираем уникальных клиентов из первого раунда
        const clientMap = new Map();
        
        firstRound.forEach(item => {
          if (!clientMap.has(item.client_id)) {
            clientMap.set(item.client_id, {
              id: item.client_id,
              name: item.client_name,
              // В первом раунде показываем первую станцию
              station: item.station_number || '',
            });
          }
        });
        
        const clientList = Array.from(clientMap.values());
        
        // Сортируем клиентов по имени
        clientList.sort((a, b) => a.name.localeCompare(b.name));
        setClients(clientList);
      } else if (hitZoneData.clients && hitZoneData.clients.length > 0) {
        // Если Scheme нет, используем клиентов из массива
        const clientList = hitZoneData.clients.slice(0, 12).map((client, index) => ({
          id: client.ClientID || `client-${index}`,
          name: client.Name || `Клиент ${index + 1}`,
          // Генерируем станции для теста
          station: `${Math.floor(index / 4) + 1}${String.fromCharCode(65 + (index % 4))}`,
        }));
        setClients(clientList);
      }
    } else {
      console.log('Page1_1: Нет данных, использую тестовые');
      // Тестовые данные по умолчанию
      setTrainingData({
        name: 'Steppe Burn',
        trainer: 'Нургалиева Зауре',
        round: 1,
        totalRounds: 16,
        currentApproach: 1,
      });
      
      // const testClients = Array.from({ length: 3 }, (_, index) => ({
      //   id: `test-${index + 1}`,
      //   name: ['Индира Мукыжанова', 'Татьяна Туркова', 'Тамилла Юрченко'][index] || `Клиент ${index + 1}`,
      //   station: ['1A', '2A', '3A'][index] || '',
      // }));

      const testClients = Array.from({ length: 11 }, (_, index) => ({
        id: `test-${index + 1}`,
        name: [
          'Индира Мукыжанова', 'Татьяна Туркова', 'Тамилла Юрченко', 
          'Алексей Петров', 'Мария Смирнова', 'Дмитрий Иванов',
          'Ольга Сидорова', 'Сергей Кузнецов', 'Елена Васильева',
          'Анна Попова', 'Игорь Николаев', 'Наталья Морозова'
        ][index] || `Клиент ${index + 1}`,
        // Станции: 1A-1D, 2A-2D, 3A-3D, 4A-4D, 5A-5D, 6A-6D
        station: `${Math.floor(index / 4) + 1}${String.fromCharCode(65 + (index % 4))}`,
      }))
      setClients(testClients);
    }
  }, []); // Пустой массив зависимостей - запускается только один раз при монтировании

  // Функция для распределения клиентов по колонкам
  const distributeClientsToColumns = () => {
    // Если клиентов <= 4 - все в левой колонке
    // Если клиентов > 4 - равномерно по двум колонкам
    
    if (clients.length <= 4) {
      return {
        leftColumn: clients,
        rightColumn: []
      };
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
    return columnClients.map((client, index) => {
      // Чередуем классы для разных цветов фона
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
                <div className="text-marina-p11">{client.name}</div>
              </div>
              <div className="frame-26-p11">
                <div className="text-2d">{client.station}</div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  // Форматирование времени для таймера
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Получение текущего раунда клиента (для прогресс-бара)
  const getClientCurrentRound = (clientId) => {
    // В реальном приложении здесь будет логика определения текущего раунда
    return currentRound;
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
                    {trainingData?.name || 'Steppe Burn'}
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
            Подход {trainingData?.currentApproach || 1}
          </div>
        </div>
        
        <div className="frame-2-p11">
          <div className="frame-16-p11">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
              let className = 'step-number-p11 ';
              if (number < currentRound) {
                className += 'active-p11';
              } else if (number === currentRound) {
                className += 'current-p11';
              } else {
                className += 'inactive-p11';
              }
              
              return (
                <div key={number} className={className}>
                  {number}
                </div>
              );
            })}
          </div>
          
          <div className="frame-18-p11">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
              let className = 'progress-step-p11 ';
              if (number < currentRound) {
                className += 'active-p11';
              } else if (number === currentRound) {
                className += 'current-p11';
              } else {
                className += 'inactive-p11';
              }
              
              return (
                <div key={number} className={className}></div>
              );
            })}
          </div>
        </div>
        
        <div className="frame-30-p11">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p11" />
          <div className="text-timer-p11">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page11;