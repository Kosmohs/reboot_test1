// src/pages/Page21.jsx
import './Page21.css';
import { useState, useEffect } from 'react';
import { fetchTrainings, getCurrentTVConfig } from '../utils/api';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import Frame65Image1 from '../assets/images/frame65-image1.png'; 
import Frame65Image2 from '../assets/images/frame65-image2.png'; 

// Простой парсер (можно вынести в отдельный файл позже)
function getStationsForOurTV(apiData, ourTelevisorId = 4) {
  if (!apiData?.data?.length) return [];
  
  // Находим первую тренировку с нашим телевизором
  const training = apiData.data.find(t => 
    t.training?.trainings?.some(st => st.televisor_id == ourTelevisorId)
  );
  
  if (!training) return [];
  
  // Фильтруем станции нашего телевизора
  return training.training.trainings
    .filter(station => station.televisor_id == ourTelevisorId)
    .map((station, index) => ({
      id: station.id,
      stationId: station.station?.id,
      name: station.station?.name,
      number: station.station?.number, // "7", "6", "15", "13", "19", "18"
      exercise: station.training?.name,
      approaches: station.number_of_approaches || 4,
      video: station.training?.video
    }));
}

function getTrainingInfo(apiData) {
  if (!apiData?.data?.length) return null;
  
  const training = apiData.data[0]; // Пока берём первую
  
  return {
    programName: training.Service?.Title || 'Тренировка',
    trainer: training.Employee?.FullName || 'Тренер',
    startTime: training.StartDate,
    endTime: training.EndDate,
    duration: training.Duration || 55, // минут
    
    // Времена (условно)
    exerciseTime: 60,    // секунд
    restTime: 45,       // секунд
    transitionTime: 30, // секунд
    warmupTime: 300,    // секунд (5 минут)
    cooldownTime: 300   // секунд (5 минут)
  };
}

function Page21() {
  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 8; // Пока фиксированное значение
  
  // Состояние для данных из API
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [tvConfig, setTvConfig] = useState(null);

  // Получаем конфигурацию телевизора при загрузке
  useEffect(() => {
    const config = getCurrentTVConfig();
    setTvConfig(config);
    console.log('Конфигурация телевизора:', config);
  }, []);

  // Загрузка данных из API
  useEffect(() => {
    const loadTrainings = async () => {
      setLoading(true);
      setApiError(null);
      
      try {
        const data = await fetchTrainings();
        console.log('API Response:', data);

        // Используем наш простой парсер
        const ourTelevisorId = tvConfig?.televisor_id || 4;
        const stations = getStationsForOurTV(data, ourTelevisorId);
        const trainingInfo = getTrainingInfo(data);
        
        console.log('Наши станции:', stations);
        console.log('Инфо тренировки:', trainingInfo);
        
        if (stations.length === 0) {
          setApiError('Нет станций для этого телевизора');
          // Демо-данные
          setTrainings([
            { 
              id: '1', 
              stationNumbers: ['7', '6'], // Демо номера
              clients: ['Клиент 1', 'Клиент 2'] 
            },
            { 
              id: '2', 
              stationNumbers: ['15', '13'], // Демо номера
              clients: ['Клиент 3', 'Клиент 4'] 
            }
          ]);
          return;
        }
        
        // Группируем станции по парам для отображения

        // Новый правильный код:
        const groupedStations = [];
        for (let i = 0; i < stations.length; i += 2) {
          const station1 = stations[i];
          const station2 = stations[i + 1];
          
          // Проверяем, что станция существует
          if (station1) {
            groupedStations.push({
              id: `group-${i}`,
              stationNumbers: [
                station1.number, 
                station2?.number || ''
              ],
              clients: [`Клиент ${i+1}`, `Клиент ${i+2}`],
              realData: {
                station1: station1,
                station2: station2
              }
            });
          }
        }

        console.log('Сгруппированные станции (исправлено):', groupedStations);
        
        // Берём только первые 2 группы для отображения (как в дизайне)
        const displayGroups = groupedStations.slice(0, 2);
        
        // Если групп меньше 2, дополняем демо-данными
        while (displayGroups.length < 2) {
          displayGroups.push({
            id: `demo-${displayGroups.length}`,
            stationNumbers: [`${displayGroups.length*2+1}`, `${displayGroups.length*2+2}`],
            clients: [`Клиент ${displayGroups.length*2+1}`, `Клиент ${displayGroups.length*2+2}`]
          });
        }
        
        setTrainings(displayGroups);
        
      } catch (error) {
        console.error('API Error:', error);
        setApiError('API недоступен, демо-данные');
        
        // Демо-данные
        setTrainings([
          { 
            id: '1', 
            stationNumbers: ['7', '6'], 
            clients: ['Клиент 1', 'Клиент 2'] 
          },
          { 
            id: '2', 
            stationNumbers: ['15', '13'], 
            clients: ['Клиент 3', 'Клиент 4'] 
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (tvConfig) {
      loadTrainings();
      
      // Обновление данных каждые 30 секунд
      const interval = setInterval(loadTrainings, 30000);
      return () => clearInterval(interval);
    }
  }, [tvConfig]);

  // Функции для тестирования раундов (оставляем как есть)
  const nextRound = () => {
    if (currentRound < totalRounds) {
      setCurrentRound(currentRound + 1);
    }
  };

  const prevRound = () => {
    if (currentRound > 1) {
      setCurrentRound(currentRound - 1);
    }
  };

  // Функция для рендеринга блока упражнения
  const renderExerciseBlock = (id, numberA, numberB, imageSrc, clients = []) => (
    <div key={id} className="frame-63-p21">
      {/* Картинка */}
      <img 
        src={imageSrc} 
        alt="Упражнение" 
        className="frame-63-image-p21"
      />
      
      {/* Frame 68 - блок с номерами станций */}
      <div className="frame-68-p21">
        <div className="text-2a-p21">{numberA}</div>
        <div className="line-1-p21"></div>
        <div className="text-2b-p21">{numberB}</div>
      </div>

      {/* Frame 74 - блок с двумя клиентами */}
      <div className="frame-74-p21">
        {/* Первый клиент */}
        <div className="frame-68-client-p21">
          <div className="frame-60-p21">
            <div className="client-avatar-p21"></div>
            <div className="client-text-p21">{clients[0] || 'Клиент 1'}</div>
          </div>
        </div>

        {/* Второй клиент */}
        <div className="frame-68-client-p21">
          <div className="frame-60-p21">
            <div className="client-avatar-p21"></div>
            <div className="client-text-p21">{clients[1] || 'Клиент 2'}</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Определяем какие данные показывать
  const displayData = trainings.length >= 2 
    ? trainings
    : [
        { 
          id: 'frame63', 
          stationNumbers: ['7', '6'], 
          clients: ['Клиент 1', 'Клиент 2']
        },
        { 
          id: 'frame64', 
          stationNumbers: ['15', '13'], 
          clients: ['Клиент 3', 'Клиент 4']
        }
      ];

  return (
    <div className="page page-21-p21">
      {/* Frame 38 - верхний блок с логотипом */}
      <div className="frame-38-p21">
        <div className="logo-p21">
          <img src={Logo} alt="Логотип" className="logo-image-p21" />
        </div>
        
        {/* Отладочная информация (скрыта) */}
        {tvConfig && (
          <div className="tv-config-debug" style={{display: 'none'}}>
            Зал: {tvConfig.gym_id}, Телевизор: {tvConfig.televisor_id}
          </div>
        )}
        
        {/* Сообщения об ошибках/загрузке (скрыты) */}
        {apiError && (
          <div className="api-error-notice" style={{display: 'none'}}>
            {apiError}
          </div>
        )}
        {loading && (
          <div className="loading-notice" style={{display: 'none'}}>
            Загрузка...
          </div>
        )}
      </div>
      
      {/* Frame 65 - центральный блок с 2 упражнениями */}
      <div className="frame-65-p21">
        {/* Frame 63 */}
        {renderExerciseBlock(
          "frame63", 
          displayData[0]?.stationNumbers?.[0] || '7', 
          displayData[0]?.stationNumbers?.[1] || '6', 
          Frame65Image1,
          displayData[0]?.clients || ['Клиент 1', 'Клиент 2']
        )}
        
        {/* Frame 64 */}
        {renderExerciseBlock(
          "frame64", 
          displayData[1]?.stationNumbers?.[0] || '15', 
          displayData[1]?.stationNumbers?.[1] || '13', 
          Frame65Image2,
          displayData[1]?.clients || ['Клиент 3', 'Клиент 4']
        )}
      </div>

      {/* Frame 1 - нижняя панель */}
      <div className="frame-1-p21">
        {/* Frame29 - с текстом "Раунд 1/8" */}
        <div className="frame-29-p21">
          <div className="text-approach-1-p21">Раунд {currentRound}/{totalRounds}</div>
        </div>
        
        {/* Frame2 - по центру */}
        <div className="frame-2-p21">
          {/* Frame16 - верхняя часть с цифрами 1-8 */}
          <div className="frame-16-p21">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`step-number-p21 ${
                  number <= currentRound ? 'active-p21' : 'current-p21'
                }`}
              >
                {number}
              </div>
            ))}
          </div>
          
          {/* Frame18 - нижняя часть (прогресс бар) */}
          <div className="frame-18-p21">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`progress-step-p21 ${
                  number <= currentRound ? 'active-p21' : 'inactive-p21'
                }`}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Frame30 - справа */}
        <div className="frame-30-p21">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p21" />
          <div className="text-timer-p21">0:30</div>
        </div>
      </div>
    </div>
  );
}

export default Page21;