// src/components/training-flow/TransitionPage2.jsx
import { useState, useEffect } from 'react';
import { useTrainingState } from './useTrainingState';
import Logo from '../../assets/images/logo.svg';
import TimerIcon from '../../assets/images/timer.svg';
import ShuffleIcon from '../../assets/images/lucide_shuffle.svg';
import ArrowDouble from '../../assets/images/arrows.svg';
import '../../pages/Page6.css';

const TransitionPage2 = () => {
  const {
    timer,
    trainingConfig,
    currentStationIndex,
    getAllClients,
    getClientStations,
    hitZoneData
  } = useTrainingState();
  
  console.log('🚶 TransitionPage2 (2 программы) рендер:', { 
    timer, 
    currentStationIndex,
    hasAllPrograms: hitZoneData?.allPrograms?.length > 0
  });
  
  const [programsData, setProgramsData] = useState([]);
  
  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Получаем данные для 2 программ
  useEffect(() => {
    console.log('🔍 Получение данных для 2 программ');
    
    // Проверяем данные из API
    const allPrograms = hitZoneData?.allPrograms || [];
    console.log('📊 Программы из API:', allPrograms.length, allPrograms);
    
    if (allPrograms.length >= 2) {
      // Используем реальные данные программ
      const program1 = allPrograms[0];
      const program2 = allPrograms[1];
      
      // Получаем клиентов для каждой программы
      const allClients = getAllClients();
      
      // Разделяем клиентов по программам (условно - первые 12 в программу 1, остальные в программу 2)
      const program1Clients = allClients.slice(0, Math.min(12, allClients.length));
      const program2Clients = allClients.slice(12, 24);
      
      // Создаём последовательности станций для каждой программы
      const stationSequence1 = ['1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A'];
      const stationSequence2 = ['1B', '2B', '3B', '4B', '5B', '6B', '7B', '8B'];
      
      const prepareClients = (clients, stationSequence, programIndex) => {
        return clients.map((client, index) => {
          const fromStationIndex = (currentStationIndex + index) % stationSequence.length;
          const toStationIndex = (fromStationIndex + 1) % stationSequence.length;
          
          const fromStation = stationSequence[fromStationIndex];
          const toStation = stationSequence[toStationIndex];
          
          return {
            ...client,
            order: index,
            currentStation: fromStation,
            nextStation: toStation,
            hasTransition: true,
            programIndex
          };
        });
      };
      
      const programs = [
        {
          id: '1',
          name: program1.name || 'Full Body 1',
          color: '#4361EE', // Синий
          clients: prepareClients(program1Clients, stationSequence1, 1),
          trainer: program1.trainer || 'Тренер 1'
        },
        {
          id: '2',
          name: program2.name || 'Full Body 2',
          color: '#F6BD60', // Желтый
          clients: prepareClients(program2Clients, stationSequence2, 2),
          trainer: program2.trainer || 'Тренер 2'
        }
      ];
      
      console.log('✅ Данные 2 программ подготовлены:', programs);
      setProgramsData(programs);
      
    } else {
      // Тестовые данные для 2 программ
      console.log('⚠️ Нет данных о программах, используем тестовые данные');
      
      // Тестовые клиенты для программы 1
      const program1Names = ['Марина', 'Анна', 'Елена', 'Ольга', 'Ирина', 'Наталья'];
      const program2Names = ['Татьяна', 'Светлана', 'Юлия', 'Мария', 'Александра', 'Екатерина'];
      
      const stationSequence1 = ['1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A'];
      const stationSequence2 = ['1B', '2B', '3B', '4B', '5B', '6B', '7B', '8B'];
      
      const createTestClients = (names, stationSequence, programIndex) => {
        return names.map((name, index) => ({
          id: `test-${programIndex}-${index + 1}`,
          name: `${name} ${index + 1}`,
          order: index,
          currentStation: stationSequence[currentStationIndex % stationSequence.length] || '1A',
          nextStation: stationSequence[(currentStationIndex + 1) % stationSequence.length] || '2A',
          hasTransition: true,
          programIndex
        }));
      };
      
      const programs = [
        {
          id: '1',
          name: 'Full Body 1',
          color: '#4361EE',
          clients: createTestClients(program1Names, stationSequence1, 1),
          trainer: 'Тренер 1'
        },
        {
          id: '2',
          name: 'Full Body 2',
          color: '#F6BD60',
          clients: createTestClients(program2Names, stationSequence2, 2),
          trainer: 'Тренер 2'
        }
      ];
      
      setProgramsData(programs);
    }
  }, [getAllClients, currentStationIndex, hitZoneData]);
  
  // Логика прогресс-бара станций для 2 программ
  const getStationStatus = (stationNumber) => {
    // stationNumber: 1-8
    // currentStationIndex: 0-7
    
    if (stationNumber < currentStationIndex + 1) {
      return 'active-p6'; // Уже пройденные станции
    } else if (stationNumber === currentStationIndex + 1) {
      return 'current-p6'; // Текущая станция
    } else {
      return 'inactive-p6'; // Будущие станции
    }
  };
  
  // Функция для рендеринга клиентов в колонке программы
  const renderProgramColumn = (program) => {
    console.log(`🔍 Рендерим программу "${program.name}":`, program.clients.length, 'клиентов');
    
    if (program.clients.length === 0) {
      return (
        <div style={{
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'center',
          padding: '20px'
        }}>
          Нет клиентов
        </div>
      );
    }
    
    // Распределяем клиентов по двум колонкам внутри программы
    const half = Math.ceil(program.clients.length / 2);
    const leftColumn = program.clients.slice(0, half);
    const rightColumn = program.clients.slice(half);
    
    return (
      <>
        <div className="frame-38-inner-p6">
          {leftColumn.map((client, index) => {
            const bgClass = index % 4;
            let frameClass;
            switch(bgClass) {
              case 0: frameClass = 'frame-54-nested-p6'; break;
              case 1: frameClass = 'frame-52-nested-p6'; break;
              case 2: frameClass = 'frame-37-nested-p6'; break;
              case 3: frameClass = 'frame-55-nested-p6'; break;
              default: frameClass = 'frame-54-nested-p6';
            }
            
            return (
              <div key={`${client.id}-${index}`} className={frameClass}>
                <div className="frame-46-p6">
                  <div className="frame-58-p6">
                    <div className="frame-10-p6">
                      <div className="image-placeholder-p6"></div>
                      <div className="text-marina-p6">{client.name}</div>
                    </div>
                    <div className="frame-26-p6">
                      <div className="text-2a-p6">{client.currentStation}</div>
                      
                      {client.hasTransition && (
                        <div className="frame-45-p6">
                          <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p6" />
                        </div>
                      )}
                      
                      <div className="text-2d-p6">{client.nextStation}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="frame-40-p6">
          {rightColumn.map((client, index) => {
            const bgClass = (index + half) % 4;
            let frameClass;
            switch(bgClass) {
              case 0: frameClass = 'frame-54-nested-p6'; break;
              case 1: frameClass = 'frame-52-nested-p6'; break;
              case 2: frameClass = 'frame-37-nested-p6'; break;
              case 3: frameClass = 'frame-55-nested-p6'; break;
              default: frameClass = 'frame-54-nested-p6';
            }
            
            return (
              <div key={`${client.id}-${index + half}`} className={frameClass}>
                <div className="frame-46-p6">
                  <div className="frame-58-p6">
                    <div className="frame-10-p6">
                      <div className="image-placeholder-p6"></div>
                      <div className="text-marina-p6">{client.name}</div>
                    </div>
                    <div className="frame-26-p6">
                      <div className="text-2a-p6">{client.currentStation}</div>
                      
                      {client.hasTransition && (
                        <div className="frame-45-p6">
                          <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p6" />
                        </div>
                      )}
                      
                      <div className="text-2d-p6">{client.nextStation}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };
  
  // Если данных о программах нет, показываем заглушку
  if (programsData.length === 0) {
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
        Загрузка данных для 2 программ...
      </div>
    );
  }
  
  return (
    <div className="page page-6-p6">
      <div className="frame-38-p6">
        <div className="logo-p6">
          <img src={Logo} alt="Логотип" className="logo-image-p6" />
        </div>
      </div>
      
      <div className="frame-37-p6">
        <div className="frame-28-p6">
          <div className="frame-27-p6">
            {/* Программа 1 */}
            <div className="frame-52-p6">
              <div className="frame-14-p6">
                <div className="frame-54-inner-p6">
                  <div className="text-full-body-1-p6">
                    {programsData[0]?.name || 'Full Body 1'}
                  </div>
                </div>
              </div>
              <div className="frame-55-p6">
                <div className="frame-47-p6">
                  {renderProgramColumn(programsData[0])}
                </div>
              </div>
            </div>
            
            {/* Программа 2 */}
            <div className="frame-53-p6">
              <div className="frame-14-p6">
                <div className="frame-54-inner-p6">
                  <div className="text-full-body-2-p6">
                    {programsData[1]?.name || 'Full Body 2'}
                  </div>
                </div>
              </div>
              <div className="frame-55-p6">
                <div className="frame-47-p6">
                  {renderProgramColumn(programsData[1])}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-1-p6">
        <div className="frame-29-p6">
          <img src={ShuffleIcon} alt="Shuffle" className="shuffle-icon-p6" />
          <div className="text-transition-p6">Переход</div>
        </div>
        
        <div className="frame-2-p6">
          <div className="frame-16-p6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
              const status = getStationStatus(number);
              console.log(`📊 Станция ${number}: ${status}`);
              return (
                <div key={number} className={`step-number-p6 ${status}`}>
                  {number}
                </div>
              );
            })}
          </div>
          
          <div className="frame-18-p6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
              const status = getStationStatus(number);
              return <div key={number} className={`progress-step-p6 ${status}`}></div>;
            })}
          </div>
        </div>
        
        <div className="frame-30-p6">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p6" />
          <div className="text-timer-p6">{formatTime(timer)}</div>
        </div>
      </div>
    </div>
  );
};

export default TransitionPage2;