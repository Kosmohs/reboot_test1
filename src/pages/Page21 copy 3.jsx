// src/pages/Page21.jsx
import './Page21.css';
import { useState, useEffect } from 'react';
import { fetchTrainings, getCurrentTVConfig } from '../utils/api';
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
  const [tvConfig, setTvConfig] = useState(null);

  // Получаем конфигурацию телевизора при загрузке (только для отладки)
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
        console.log('API Response (Page21):', data);

        const apiData = data.data || [];
        
        if (apiData.length === 0) {
          console.log('Нет активных тренировок, показываем демо-данные');
          // Демо-данные для тестирования верстки
          const demoData = [
            { 
              id: 'demo-1', 
              stationCode: '2A|2B', 
              clients: ['Клиент 1', 'Клиент 2'],
              serviceTitle: 'Upper Zone Level 1',
              trainer: 'Иван Иванов'
            },
            { 
              id: 'demo-2', 
              stationCode: '2C|2D', 
              clients: ['Клиент 3', 'Клиент 4'],
              serviceTitle: 'Lower Zone Level 1',
              trainer: 'Петр Петров'
            }
          ];
          
          setTrainings(demoData);
          setApiError('Нет активных тренировок, демо-режим');
          return;
        }
        
        // ОБРАБОТКА РЕАЛЬНЫХ ДАННЫХ ОТ API
        // TODO: Адаптировать под реальную структуру данных
        
        let formattedTrainings = apiData.slice(0, 2).map((appointment, index) => {
          // Предполагаемая структура (нужно уточнить у бекендера)
          const clientNames = appointment.Clients?.map(client => 
            client.Name || client.FullName || `Клиент ${index+1}`
          ) || [];
          
          // Станции: можно брать из appointment.Station или appointment.Room
          const stationCode = index === 0 ? '2A|2B' : '2C|2D';
          
          return {
            id: appointment.id || appointment.AppointmentID || `app-${index}`,
            stationCode: appointment.Station || stationCode,
            clients: clientNames.length > 0 
              ? clientNames.slice(0, 2) 
              : [`Клиент ${index*2+1}`, `Клиент ${index*2+2}`],
            serviceTitle: appointment.Service?.Title || appointment.ProgramName || 'Тренировка',
            trainer: appointment.Employee?.FullName || appointment.TrainerName || 'Тренер'
          };
        });

        console.log('Formatted Trainings:', formattedTrainings);
        setTrainings(formattedTrainings);
        setApiError(null);
        
      } catch (error) {
        console.error('API Error:', error);
        
        // Не показываем ошибку пользователю, просто используем демо-данные
        const demoData = [
          { 
            id: 'error-1', 
            stationCode: '2A|2B', 
            clients: ['Клиент 1', 'Клиент 2'],
            serviceTitle: 'Upper Zone Level 1',
            trainer: 'Иван Иванов'
          },
          { 
            id: 'error-2', 
            stationCode: '2C|2D', 
            clients: ['Клиент 3', 'Клиент 4'],
            serviceTitle: 'Lower Zone Level 1',
            trainer: 'Петр Петров'
          }
        ];
        
        setTrainings(demoData);
      } finally {
        setLoading(false);
      }
    };

    loadTrainings();
    
    // Обновление данных каждые 30 секунд
    const interval = setInterval(loadTrainings, 30000);
    return () => clearInterval(interval);
  }, []);

  // Функция для рендеринга блока упражнения
  const renderExerciseBlock = (id, labelA, labelB, imageSrc, clients = [], trainingData = {}) => (
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
      
      {/* УБИРАЕМ ДОПОЛНИТЕЛЬНУЮ ИНФОРМАЦИЮ - она не нужна на странице! */}
    </div>
  );

  // Определяем какие данные показывать
  const displayData = trainings.length >= 2 
    ? [
        { 
          id: 'frame63', 
          labels: trainings[0]?.stationCode?.split('|') || ['2A', '2B'],
          clients: trainings[0]?.clients || ['Клиент 1', 'Клиент 2'],
          trainingData: trainings[0] || {}
        },
        { 
          id: 'frame64', 
          labels: trainings[1]?.stationCode?.split('|') || ['2C', '2D'],
          clients: trainings[1]?.clients || ['Клиент 3', 'Клиент 4'],
          trainingData: trainings[1] || {}
        }
      ]
    : [
        { 
          id: 'frame63', 
          labels: ['2A', '2B'], 
          clients: ['Клиент 1', 'Клиент 2'],
          trainingData: {}
        },
        { 
          id: 'frame64', 
          labels: ['2C', '2D'], 
          clients: ['Клиент 3', 'Клиент 4'],
          trainingData: {}
        }
      ];

  return (
    <div className="page page-21-p21">
      {/* Frame 38 - верхний блок с логотипом */}
      <div className="frame-38-p21">
        <div className="logo-p21">
          <img src={Logo} alt="Логотип" className="logo-image-p21" />
        </div>
        
        {/* УБИРАЕМ ОТЛАДОЧНУЮ ИНФОРМАЦИЮ - она не нужна пользователю! */}
        {/* {tvConfig && (
          <div className="tv-config-debug" style={{display: 'none'}}>
            Зал: {tvConfig.gym_id}, Телевизор: {tvConfig.televisor_id}
          </div>
        )} */}
        
        {/* Сообщения об ошибках/загрузке можно оставить скрытыми или убрать */}
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
          displayData[0].labels[0] || '2A', 
          displayData[0].labels[1] || '2B', 
          Frame65Image1,
          displayData[0].clients
        )}
        
        {/* Frame 64 */}
        {renderExerciseBlock(
          "frame64", 
          displayData[1].labels[0] || '2C', 
          displayData[1].labels[1] || '2D', 
          Frame65Image2,
          displayData[1].clients
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