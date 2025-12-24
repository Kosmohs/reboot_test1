// src/components/training-flow/StartPage2.jsx
import { useState, useEffect } from 'react';
import { useTrainingState } from './useTrainingState';
import '../../pages/Page10.css';
import Logo from '../../assets/images/logo.svg';
import TimerIcon from '../../assets/images/timer.svg';


const StartPage2 = () => {
  const {
    timer,
    trainingConfig,
    currentStationIndex,
    currentApproach,
    getAllClients
  } = useTrainingState();
  
  console.log('🎬 StartPage2 рендер (2 программы):', { 
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
      // Fallback: тестовые данные для отладки (8+8 клиентов)
      console.log('⚠️ Нет данных клиентов, используем тестовые');
      const testClients = [];
      for (let i = 1; i <= 16; i++) {
        testClients.push({
          id: `${i}`,
          name: `Тестовый Клиент ${i}`,
          station: `${(i % 8) + 1}${String.fromCharCode(65 + (i % 2))}`,
          program: i <= 8 ? 'Full Body 1' : 'Full Body 2' // Разделяем на 2 программы
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
  
  // Разделение клиентов на две группы (программы)
  const splitClientsByProgram = () => {
    if (clients.length === 0) {
      return { program1: [], program2: [] };
    }
    
    // Если у клиентов есть поле program, группируем по нему
    const program1Clients = clients.filter(client => 
      client.program?.includes('1') || client.program?.includes('Full Body 1')
    );
    const program2Clients = clients.filter(client => 
      client.program?.includes('2') || client.program?.includes('Full Body 2')
    );
    
    // Если нет явного разделения, делим пополам
    if (program1Clients.length === 0 && program2Clients.length === 0) {
      const half = Math.ceil(clients.length / 2);
      return {
        program1: clients.slice(0, half),
        program2: clients.slice(half)
      };
    }
    
    return {
      program1: program1Clients,
      program2: program2Clients
    };
  };
  
  const { program1, program2 } = splitClientsByProgram();
  
  // Функция для рендеринга элементов колонки
  const renderColumnElements = (columnClients, isLeftColumn = true) => {
    console.log(`🔍 Рендерим ${isLeftColumn ? 'левую' : 'правую'} колонку:`, 
                columnClients.length, 'клиентов');
    
    // Для левой колонки: 5 в первой части, остальные во второй
    // Для правой колонки: по 4 в каждой части
    if (isLeftColumn) {
      const firstPart = columnClients.slice(0, 5);
      const secondPart = columnClients.slice(5);
      
      return (
        <>
          <div className="frame-38-inner-p10">
            {firstPart.map((client, index) => (
              <div key={client.id} className={`frame-${index % 2 === 0 ? '54' : '52'}-nested-p10`}>
                <div className="frame-46-p10">
                  <div className="frame-58-p10">
                    <div className="frame-10-p10">
                      <div className="image-placeholder-p10"></div>
                      <div className="text-marina-p10">
                        {client.name || `Клиент ${client.id}`}
                      </div>
                    </div>
                    <div className="frame-26-p10">
                      <div className="text-2d">{client.station || '--'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="frame-40-p10">
            {secondPart.map((client, index) => (
              <div key={client.id} className={`frame-${index % 2 === 0 ? '54' : '52'}-nested-p10`}>
                <div className="frame-46-p10">
                  <div className="frame-58-p10">
                    <div className="frame-10-p10">
                      <div className="image-placeholder-p10"></div>
                      <div className="text-marina-p10">
                        {client.name || `Клиент ${client.id}`}
                      </div>
                    </div>
                    <div className="frame-26-p10">
                      <div className="text-2d">{client.station || '--'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    } else {
      // Правая колонка: делим пополам
      const half = Math.ceil(columnClients.length / 2);
      const firstPart = columnClients.slice(0, half);
      const secondPart = columnClients.slice(half);
      
      return (
        <>
          <div className="frame-38-inner-p10">
            {firstPart.map((client, index) => (
              <div key={client.id} className={`frame-${index % 2 === 0 ? '54' : '52'}-nested-p10`}>
                <div className="frame-46-p10">
                  <div className="frame-58-p10">
                    <div className="frame-10-p10">
                      <div className="image-placeholder-p10"></div>
                      <div className="text-marina-p10">
                        {client.name || `Клиент ${client.id}`}
                      </div>
                    </div>
                    <div className="frame-26-p10">
                      <div className="text-2d">{client.station || '--'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="frame-39-inner-p10">
            {secondPart.map((client, index) => (
              <div key={client.id} className={`frame-${index % 2 === 0 ? '54' : '52'}-nested-p10`}>
                <div className="frame-46-p10">
                  <div className="frame-58-p10">
                    <div className="frame-10-p10">
                      <div className="image-placeholder-p10"></div>
                      <div className="text-marina-p10">
                        {client.name || `Клиент ${client.id}`}
                      </div>
                    </div>
                    <div className="frame-26-p10">
                      <div className="text-2d">{client.station || '--'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }
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
    <div className="page page-10-p10">
      <div className="frame-38-p10">
        <div className="logo-p10">
          <img src={Logo} alt="Логотип" className="logo-image-p10" />
        </div>
      </div>
      
      <div className="frame-37-p10">
        <div className="frame-28-p10">
          <div className="frame-27-p10">
            {/* Frame52 - ЛЕВАЯ колонка (Full Body 1) */}
            <div className="frame-52-p10">
              <div className="frame-14-p10 green-bg-p10">
                <div className="frame-54-inner-p10">
                  <div className="text-full-body-1-p10">
                    {trainingConfig?.name || 'Full Body 1'}
                  </div>
                </div>
              </div>
              <div className="frame-47-left-p10">
                {renderColumnElements(program1, true)}
              </div>
            </div>
            
            {/* Frame53 - ПРАВАЯ колонка (Full Body 2) */}
            <div className="frame-53-p10">
              <div className="frame-14-p10 blue-bg-p10">
                <div className="frame-54-inner-p10">
                  <div className="text-full-body-2-p10">
                    {trainingConfig?.name || 'Full Body 2'}
                  </div>
                </div>
              </div>
              <div className="frame-47-right-p10">
                {renderColumnElements(program2, false)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-1-p10">
        <div className="frame-29-p10">
          <div className="text-approach-1-p10">
            Подход {currentApproach}
          </div>
        </div>
        
        <div className="frame-2-p10">
          <div className="frame-16-p10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`step-number-p10 ${
                  number === currentStationIndex + 1 ? 'current-p10' : 
                  number < currentStationIndex + 1 ? 'active-p10' : 
                  'inactive-p10'
                }`}
              >
                {number}
              </div>
            ))}
          </div>
          
          <div className="frame-18-p10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <div 
                key={number} 
                className={`progress-step-p10 ${
                  number === currentStationIndex + 1 ? 'current-p10' : 
                  number < currentStationIndex + 1 ? 'active-p10' : 
                  'inactive-p10'
                }`}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="frame-30-p10">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p10" />
          <div className="text-timer-p10">
            {formatTime(timer)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage2;