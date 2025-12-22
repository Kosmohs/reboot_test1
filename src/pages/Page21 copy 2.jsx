// src/pages/Page21.jsx
import './Page21.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import Frame65Image1 from '../assets/images/frame65-image1.png'; 
import Frame65Image2 from '../assets/images/frame65-image2.png'; 

function Page21() {
  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 8;
  
  // Состояние для данных из API
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Загрузка данных из API
  useEffect(() => {
    const fetchTrainings = async () => {
      setLoading(true);
      setApiError(null);
      
      try {
        const response = await axios.get(
          'https://109.233.108.14/api/site/trainings?gym_id=1&televisor_id=4',
          {
            headers: {
              'X-API-KEY': 'I3d54a0P1dT1XmHQlBL7Md2Qtp5EZgxuZ4a6eb8SRH446V9chelZCbQB9I89Xctt',
              'clubId': '1',
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        );
        
        console.log('API Response:', response.data);

        const apiData = response.data.data || [];
        console.log('Raw API Data:', apiData);
        
        // // Парсим данные в нашу структуру
        // const formattedTrainings = apiData.slice(0, 2).map((appointment, index) => {
        //   // Берем имена клиентов из API
        //   const clientNames = appointment.Clients?.map(client => client.Name) || [];
          
        //   // Станции: первая "2A|2B", вторая "2C|2D"
        //   const stationCode = index === 0 ? '2A|2B' : '2C|2D';
          
        //   return {
        //     id: appointment.AppointmentID || `appointment-${index}`,
        //     stationCode: stationCode,
        //     clients: clientNames.length > 0 ? clientNames : [`Клиент ${index*2+1}`, `Клиент ${index*2+2}`]
        //   };
        // });

        // Создаем 2 карточки из одной тренировки
        let formattedTrainings = [];

        if (apiData.length > 0) {
          const appointment = apiData[0];
          // const clientNames = appointment.Clients?.map(client => client.Name) || [];
          const clientNames = appointment.Clients?.map(client => {
            // Если есть имя - используем, если нет - используем ID или номер
            return client.Name || `Клиент ${client.ClientID?.slice(-4) || '1'}`;
          }) || [];
          
          // РАСШИРИМ ДАННЫЕ О КЛИЕНТАХ:
          console.log('Clients from API:', appointment.Clients);
          console.log('Employee:', appointment.Employee);
          console.log('All appointment keys:', Object.keys(appointment));
          
          // Карточка 1: "2A|2B" с реальными клиентами
          formattedTrainings.push({
            id: appointment.AppointmentID + '-1',
            stationCode: '2A|2B',
            clients: clientNames.length > 0 
              ? clientNames.slice(0, 2) // Берем первых двух клиентов
              : ['Клиент 1', 'Клиент 2'],
            serviceTitle: appointment.Service?.Title || 'Upper Zone Level 1',
            trainer: appointment.Employee?.FullName || 'Тренер'
          });
          
          // Карточка 2: "2C|2D" - дублируем или создаем демо
          formattedTrainings.push({
            id: appointment.AppointmentID + '-2',
            stationCode: '2C|2D',
            clients: clientNames.length >= 4 
              ? clientNames.slice(2, 4) // Берем следующих двух клиентов
              : clientNames.length > 0 
                ? [clientNames[0] + ' (2)', clientNames[1] + ' (2)'] // Дублируем с пометкой
                : ['Клиент 3', 'Клиент 4']
          });
        } else {
          // Демо-данные если нет API данных
          formattedTrainings = [
            { id: 'demo-1', stationCode: '2A|2B', clients: ['Клиент 1', 'Клиент 2'] },
            { id: 'demo-2', stationCode: '2C|2D', clients: ['Клиент 3', 'Клиент 4'] }
          ];
        }

        console.log('Formatted Trainings:', formattedTrainings);
        
        
        setTrainings(formattedTrainings);
        setApiError(null);
        
      } catch (error) {
        console.error('API Error:', error);
        setApiError('API недоступен, используются демо-данные');
        
        // Демо-данные если API недоступен
        setTrainings([
          { id: '1', stationCode: '2A|2B', clients: ['Клиент 1', 'Клиент 2'] },
          { id: '2', stationCode: '2C|2D', clients: ['Клиент 3', 'Клиент 4'] }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
    
    // Обновление данных каждые 30 секунд
    const interval = setInterval(fetchTrainings, 30000);
    return () => clearInterval(interval);
  }, []);

  // Функции для тестирования
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
  // const renderExerciseBlock = (id, labelA, labelB, imageSrc, clientName = "Клиент 1") => (
  const renderExerciseBlock = (id, labelA, labelB, imageSrc, clientName = "Клиент 1", trainingData = {}) => (
    <div key={id} className="frame-63-p21">
      {/* Картинка */}
      <img 
        src={imageSrc} 
        alt="Упражнение" 
        className="frame-63-image-p21"
      />
      
      {/* Frame 68 - блок с 2A | 2B */}
      <div className="frame-68-p21">
        <div className="text-2a-p21">{labelA}</div>
        <div className="line-1-p21"></div>
        <div className="text-2b-p21">{labelB}</div>
      </div>

      {/* Frame 74 - блок с двумя клиентами */}
      <div className="frame-74-p21">
        {/* Первый клиент */}
        <div className="frame-68-client-p21">
          <div className="frame-60-p21">
            <div className="client-avatar-p21"></div>
            <div className="client-text-p21">{clientName}</div>
          </div>
        </div>

        {/* Второй клиент */}
        <div className="frame-68-client-p21">
          <div className="frame-60-p21">
            <div className="client-avatar-p21"></div>
            <div className="client-text-p21">{clientName}</div>
          </div>
        </div>
      </div>

      {/* Дополнительная информация если есть */}
      {trainingData.serviceTitle && (
        <div className="training-info">
          <div className="training-title">{trainingData.serviceTitle}</div>
          {trainingData.trainer && (
            <div className="trainer-name">Тренер: {trainingData.trainer}</div>
          )}
        </div>
      )}
      
    </div>
  );

  // Определяем какие данные показывать
  const displayData = trainings.length >= 2 
    ? [
        { 
          id: 'frame63', 
          labels: trainings[0]?.stationCode?.split('|') || ['2A', '2B'],
          clients: trainings[0]?.clients || ['Клиент 1', 'Клиент 1']
        },
        { 
          id: 'frame64', 
          labels: trainings[1]?.stationCode?.split('|') || ['2C', '2D'],
          clients: trainings[1]?.clients || ['Клиент 1', 'Клиент 1']
        }
      ]
    : [
        { id: 'frame63', labels: ['2A', '2B'], clients: ['Клиент 1', 'Клиент 1'] },
        { id: 'frame64', labels: ['2C', '2D'], clients: ['Клиент 1', 'Клиент 1'] }
      ];

  return (
    <div className="page page-21-p21">
      {/* Frame 38 - верхний блок с логотипом */}
      <div className="frame-38-p21">
        <div className="logo-p21">
          <img src={Logo} alt="Логотип" className="logo-image-p21" />
        </div>
        {apiError && <div className="api-error-notice">{apiError}</div>}
      </div>
      
      {/* Frame 65 - центральный блок с 2 упражнениями */}
      <div className="frame-65-p21">
        {/* Frame 63 */}
        {renderExerciseBlock(
          "frame63", 
          displayData[0].labels[0] || '2A', 
          displayData[0].labels[1] || '2B', 
          Frame65Image1,
          displayData[0].clients[0] || 'Клиент 1'
        )}
        
        {/* Frame 64 */}
        {renderExerciseBlock(
          "frame64", 
          displayData[1].labels[0] || '2C', 
          displayData[1].labels[1] || '2D', 
          Frame65Image2,
          displayData[1].clients[0] || 'Клиент 1'
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