// src/components/training-flow/StartPage3.jsx
import { useState, useEffect } from 'react';
import { useTrainingState } from './useTrainingState';
import '../../pages/Page1.css';
import Logo from '../../assets/images/logo.svg';
import TimerIcon from '../../assets/images/timer.svg';


const StartPage3 = () => {
  const {
    timer,
    trainingConfig,
    currentStationIndex,
    currentApproach,
    getAllClients,
    getProgramsData // Допустим, есть функция для получения данных программ
  } = useTrainingState();
  
  console.log('🎬 StartPage3 рендер (3 программы):', { 
    timer, 
    stationIndex: currentStationIndex,
    approach: currentApproach 
  });
  
  const [programs, setPrograms] = useState([]);
  const [currentTime, setCurrentTime] = useState(120);

  // Инициализация данных программ
  useEffect(() => {
    console.log('✅ Инициализация StartPage3');
    
    // Попробуем получить данные программ из состояния
    let programsData = [];
    
    if (getProgramsData && typeof getProgramsData === 'function') {
      programsData = getProgramsData();
      console.log('✅ Программы из getProgramsData:', programsData);
    } else {
      // Fallback: получаем клиентов и распределяем по 3 программам
      const clientsData = getAllClients();
      console.log('✅ Клиенты из getAllClients:', clientsData?.length);
      
      if (clientsData && clientsData.length > 0) {
        // Распределяем клиентов по 3 программам
        const clientsPerProgram = Math.ceil(clientsData.length / 3);
        
        programsData = [
          {
            id: 'program-1',
            name: trainingConfig?.name || 'Full Body 1',
            clientCount: Math.min(clientsPerProgram, clientsData.length),
            clients: clientsData.slice(0, clientsPerProgram)
          },
          {
            id: 'program-2',
            name: trainingConfig?.name || 'Full Body 2',
            clientCount: Math.min(clientsPerProgram, Math.max(0, clientsData.length - clientsPerProgram)),
            clients: clientsData.slice(clientsPerProgram, clientsPerProgram * 2)
          },
          {
            id: 'program-3',
            name: trainingConfig?.name || 'Full Body 3',
            clientCount: Math.max(0, clientsData.length - clientsPerProgram * 2),
            clients: clientsData.slice(clientsPerProgram * 2)
          }
        ];
      }
    }
    
    // Заполняем до 3 программ
    const finalPrograms = [...programsData];
    for (let i = finalPrograms.length; i < 3; i++) {
      finalPrograms.push({
        id: `empty-${i}`,
        name: `Программа ${i + 1}`,
        trainer: 'Тренер',
        clientCount: 0,
        clients: []
      });
    }
    
    setPrograms(finalPrograms.slice(0, 3)); // Берем только 3 программы
    console.log('✅ Установлены программы:', finalPrograms);
    
  }, [getAllClients, getProgramsData, trainingConfig]);

  // Таймер на основе состояния
  useEffect(() => {
    setCurrentTime(timer);
  }, [timer]);

  // Функция для рендеринга клиентов программы
  const renderProgramClients = (programClients, programIndex) => {
    // Максимум 8 клиентов на программу
    const clientsToShow = programClients.slice(0, 8);
    
    // Разделяем на 2 колонки
    const firstColumn = clientsToShow.slice(0, Math.min(4, Math.ceil(clientsToShow.length / 2)));
    const secondColumn = clientsToShow.slice(firstColumn.length);
    
    const renderClient = (client, index, isLeftColumn = true) => {
      const bgClass = index % 4;
      let frameClass;
      switch(bgClass) {
        case 0: frameClass = 'frame-54-nested'; break;
        case 1: frameClass = 'frame-52-nested'; break;
        case 2: frameClass = 'frame-37-nested'; break;
        case 3: frameClass = 'frame-55-nested'; break;
        default: frameClass = 'frame-54-nested';
      }
      
      // Станция: номер программы + буква (1A, 1B, 2A, 2B и т.д.)
      const stationLetter = String.fromCharCode(65 + (index % 4));
      const stationNumber = `${programIndex + 1}${stationLetter}`;
      
      return (
        <div key={client.id} className={frameClass}>
          <div className="frame-46">
            <div className="frame-58">
              <div className="frame-10">
                <div className="image-placeholder"></div>
                <div className="text-marina">
                  {client.name || `Клиент ${client.id}`}
                </div>
              </div>
              <div className="frame-26">
                <div className="text-2d">{client.station || stationNumber}</div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="frame-47">
        <div className="frame-38-inner">
          {firstColumn.map((client, index) => renderClient(client, index, true))}
        </div>
        
        <div className="frame-40">
          {secondColumn.map((client, index) => 
            renderClient(client, index + firstColumn.length, false)
          )}
        </div>
      </div>
    );
  };

  // Функция для рендеринга программы
  const renderProgram = (program, index) => {
    const frameClasses = ['frame-52', 'frame-53', 'frame-54'];
    const textClasses = ['text-full-body-1', 'text-full-body-2', 'text-full-body-3'];
    const defaultNames = ['Full Body 1', 'Full Body 2', 'Full Body 3'];
    
    // Проверяем что программа существует
    if (!program || program.clientCount === 0) {
      return (
        <div key={program.id} className={frameClasses[index] || 'frame-52'}>
          <div className="frame-14">
            <div className="frame-54-inner">
              <div className={textClasses[index] || 'text-full-body-1'}>
                {program.name || defaultNames[index] || `Программа ${index + 1}`}
              </div>
            </div>
          </div>
          <div className="frame-55">
            <div className="frame-47">
              <div className="frame-38-inner">
                {/* Пустые блоки */}
                {Array.from({ length: 4 }, (_, i) => {
                  const bgClass = i % 4;
                  let frameClass;
                  switch(bgClass) {
                    case 0: frameClass = 'frame-54-nested'; break;
                    case 1: frameClass = 'frame-52-nested'; break;
                    case 2: frameClass = 'frame-37-nested'; break;
                    case 3: frameClass = 'frame-55-nested'; break;
                    default: frameClass = 'frame-54-nested';
                  }
                  
                  return (
                    <div key={`empty-${i}`} className={frameClass}>
                      <div className="frame-46">
                        <div className="frame-58">
                          <div className="frame-10">
                            <div className="image-placeholder"></div>
                            <div className="text-marina">Пусто</div>
                          </div>
                          <div className="frame-26">
                            <div className="text-2d">-</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="frame-40">
                {Array.from({ length: 4 }, (_, i) => {
                  const bgClass = (i + 4) % 4;
                  let frameClass;
                  switch(bgClass) {
                    case 0: frameClass = 'frame-54-nested'; break;
                    case 1: frameClass = 'frame-52-nested'; break;
                    case 2: frameClass = 'frame-37-nested'; break;
                    case 3: frameClass = 'frame-55-nested'; break;
                    default: frameClass = 'frame-54-nested';
                  }
                  
                  return (
                    <div key={`empty-right-${i}`} className={frameClass}>
                      <div className="frame-46">
                        <div className="frame-58">
                          <div className="frame-10">
                            <div className="image-placeholder"></div>
                            <div className="text-marina">Пусто</div>
                          </div>
                          <div className="frame-26">
                            <div className="text-2d">-</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div key={program.id} className={frameClasses[index] || 'frame-52'}>
        <div className="frame-14">
          <div className="frame-54-inner">
            <div className={textClasses[index] || 'text-full-body-1'}>
              {program.name || defaultNames[index] || `Программа ${index + 1}`}
            </div>
          </div>
        </div>
        <div className="frame-55">
          {renderProgramClients(program.clients || [], index)}
        </div>
      </div>
    );
  };

  // Форматирование времени для таймера
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Если программ нет, показываем заглушку
  if (programs.length === 0) {
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
        Загрузка программ...
      </div>
    );
  }

  return (
    <div className="page page-1">
      <div className="frame-38">
        <div className="logo">
          <img src={Logo} alt="Логотип" className="logo-image" />
        </div>
      </div>
      
      <div className="frame-37">
        <div className="frame-28">
          <div className="frame-27">
            {programs.map((program, index) => renderProgram(program, index))}
          </div>
        </div>
      </div>

      <div className="frame-1">
        <div className="frame-29">
          <div className="text-approach-1">
            Подход {currentApproach}
          </div>
        </div>
        
        <div className="frame-2">
          <div className="frame-16">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
              let className = 'step-number ';
              if (number < currentStationIndex + 1) {
                className += 'active';
              } else if (number === currentStationIndex + 1) {
                className += 'active';
              }
              
              return (
                <div key={number} className={className}>
                  {number}
                </div>
              );
            })}
          </div>
          
          <div className="frame-18">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
              let className = 'progress-step ';
              if (number < currentStationIndex + 1) {
                className += 'active';
              } else if (number === currentStationIndex + 1) {
                className += 'active';
              }
              
              return (
                <div key={number} className={className}></div>
              );
            })}
          </div>
        </div>
        
        <div className="frame-30">
          <img src={TimerIcon} alt="Timer" className="timer-icon" />
          <div className="text-timer">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage3;