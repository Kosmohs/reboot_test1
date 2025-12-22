// src/pages/Page1.jsx - исправленная версия
import './Page1.css';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function Page1() {
  console.log('⚡ Page1 компонент РЕНДЕРИТСЯ');
  const location = useLocation();
  const hitZoneData = location.state?.hitZoneData || {};
  
  const [trainingData, setTrainingData] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [currentTime, setCurrentTime] = useState(120);
  const [currentRound, setCurrentRound] = useState(1);
  const timerRef = useRef(null);

  // ДЕБАГ: сразу при монтировании
  useEffect(() => {
    console.log('🔍 Page1 mounted');
    console.log('🔍 location:', location);
    console.log('🔍 location.state:', location.state);
    console.log('🔍 hitZoneData keys:', Object.keys(hitZoneData));
  }, []);

  // Таймер
  useEffect(() => {
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
  }, [trainingData]);

  // ОСНОВНОЙ ЭФФЕКТ: обработка данных при изменении location.state
  useEffect(() => {
    console.log('📍 useEffect triggered');
    console.log('📍 Page1 location.state:', location.state);
    console.log('📍 Page1 hitZoneData из location:', hitZoneData);
    console.log('📍 Page1 hitZoneData keys:', Object.keys(hitZoneData));

    if (hitZoneData.Scheme) {
      console.log('📍 Page1: REAL Scheme data from API!', hitZoneData.Scheme.length, 'rounds');
      console.log('📍 Page1 first round:', hitZoneData.Scheme[0]);
    }
    
    if (hitZoneData && Object.keys(hitZoneData).length > 0) {
      console.log('✅ Page1: Данные получены!');
      console.log('✅ allPrograms:', hitZoneData.allPrograms);
      console.log('✅ trainingInfo:', hitZoneData.trainingInfo);
      
      setTrainingData(hitZoneData.trainingInfo || {});
      
      // Используем данные из hitZoneData
      const allPrograms = hitZoneData.allPrograms || [];
      console.log('✅ Всего программ в данных:', allPrograms.length);
      
      // Преобразуем данные
      const programsToShow = allPrograms.slice(0, 3).map((program, index) => {
        console.log(`✅ Программа ${index}:`, program);
        
        // Клиенты
        let clients = [];
        if (program.clients && Array.isArray(program.clients)) {
          clients = program.clients.map(client => ({
            id: client.ClientID || client.id || `client-${index}`,
            name: client.Name || client.name || `Клиент ${index + 1}`
          }));
        }
        
        return {
          id: program.id || `program-${index + 1}`,
          name: program.name || `Программа ${index + 1}`,
          trainer: program.trainer || 'Тренер',
          clientCount: program.clientCount || clients.length,
          clients: clients
        };
      });
      
      console.log('✅ Программы для отображения:', programsToShow);
      
      // Заполняем до 3 программ
      const finalPrograms = [...programsToShow];
      for (let i = finalPrograms.length; i < 3; i++) {
        finalPrograms.push({
          id: `empty-${i}`,
          name: `Программа ${i + 1}`,
          trainer: 'Тренер',
          clientCount: 0,
          clients: []
        });
      }
      
      setPrograms(finalPrograms);
    } else {
      console.log('❌ Page1: НЕТ данных в hitZoneData!');
      console.log('❌ Показываю fallback данные...');
      
      // Fallback тестовые данные
      setTrainingData({
        name: 'HIT ZONE (3 программы)',
        trainer: 'Тренер Тест',
        round: 1,
        totalRounds: 16,
        currentApproach: 1
      });
      
      const testPrograms = [
        {
          id: '1',
          name: 'Full Body 1',
          trainer: 'Тренер 1',
          clientCount: 8,
          clients: Array.from({ length: 8 }, (_, i) => ({
            id: `client-1-${i + 1}`,
            name: `Клиент 1-${i + 1}`
          }))
        },
        {
          id: '2',
          name: 'Full Body 2',
          trainer: 'Тренер 2',
          clientCount: 6,
          clients: Array.from({ length: 6 }, (_, i) => ({
            id: `client-2-${i + 1}`,
            name: `Клиент 2-${i + 1}`
          }))
        },
        {
          id: '3',
          name: 'Full Body 3',
          trainer: 'Тренер 3',
          clientCount: 4,
          clients: Array.from({ length: 4 }, (_, i) => ({
            id: `client-3-${i + 1}`,
            name: `Клиент 3-${i + 1}`
          }))
        }
      ];
      
      setPrograms(testPrograms);
    }
  }, [location.state, hitZoneData]); // ← ВАЖНО: следим за location.state
  
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
                <div className="text-marina">{client.name}</div>
              </div>
              <div className="frame-26">
                <div className="text-2d">{stationNumber}</div>
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
            Подход {trainingData?.currentApproach || 1}
          </div>
        </div>
        
        <div className="frame-2">
          <div className="frame-16">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
              let className = 'step-number ';
              if (number < currentRound) {
                className += 'active';
              } else if (number === currentRound) {
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
              if (number < currentRound) {
                className += 'active';
              } else if (number === currentRound) {
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
}

export default Page1;