// src/components/training-flow/TransitionPage3.jsx
import { useState, useEffect } from 'react';
import { useTrainingState } from './useTrainingState';
import Logo from '../../assets/images/logo.svg';
import TimerIcon from '../../assets/images/timer.svg';
import ShuffleIcon from '../../assets/images/lucide_shuffle.svg';
import ArrowDouble from '../../assets/images/arrows.svg';
import '../../pages/Page9_2.css';

const TransitionPage3 = () => {
  const {
    timer,
    trainingConfig,
    currentStationIndex,
    getAllClients,
    getClientStations,
    hitZoneData
  } = useTrainingState();
  
  console.log('🚶 TransitionPage3 (3 программы) рендер:', { 
    timer, 
    currentStationIndex,
    hasAllPrograms: hitZoneData?.allPrograms?.length > 0,
    allProgramsCount: hitZoneData?.allPrograms?.length
  });
  
  const [programsData, setProgramsData] = useState([]);
  
  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Получаем данные для 3 программ
  useEffect(() => {
    console.log('🔍 Получение данных для 3 программ');
    
    // Проверяем данные из API
    const allPrograms = hitZoneData?.allPrograms || [];
    console.log('📊 Программы из API:', allPrograms);
    
    if (allPrograms.length >= 3) {
      // Используем реальные данные программ
      const programs = allPrograms.slice(0, 3).map((program, index) => ({
        id: program.id || `program-${index + 1}`,
        name: program.name || `Full Body ${index + 1}`,
        color: getProgramColor(index),
        trainer: program.trainer || `Тренер ${index + 1}`,
        clientCount: program.clientCount || 0,
        training: program.training || {}
      }));
      
      // Получаем всех клиентов
      const allClients = getAllClients();
      console.log('👥 Всего клиентов:', allClients.length);
      
      // Распределяем клиентов по программам (условно: по 8 на каждую)
      const clientsPerProgram = Math.min(8, Math.floor(allClients.length / 3));
      const preparedPrograms = programs.map((program, programIndex) => {
        const startIndex = programIndex * clientsPerProgram;
        const endIndex = Math.min(startIndex + clientsPerProgram, allClients.length);
        const programClients = allClients.slice(startIndex, endIndex);
        
        // Создаём последовательность станций для программы
        const stationSequence = getStationSequenceForProgram(programIndex);
        
        const preparedClients = programClients.map((client, clientIndex) => {
          const fromStationIndex = (currentStationIndex + clientIndex) % stationSequence.length;
          const toStationIndex = (fromStationIndex + 1) % stationSequence.length;
          
          return {
            ...client,
            order: clientIndex,
            currentStation: stationSequence[fromStationIndex],
            nextStation: stationSequence[toStationIndex],
            hasTransition: true,
            programIndex
          };
        });
        
        return {
          ...program,
          clients: preparedClients
        };
      });
      
      console.log('✅ Данные 3 программ подготовлены:', preparedPrograms);
      setProgramsData(preparedPrograms);
      
    } else {
      // Тестовые данные для 3 программ
      console.log('⚠️ Нет данных о программах, используем тестовые данные');
      
      const testPrograms = [
        {
          id: '1',
          name: 'Full Body 1',
          color: getProgramColor(0),
          trainer: 'Тренер 1',
          clients: []
        },
        {
          id: '2',
          name: 'Full Body 2',
          color: getProgramColor(1),
          trainer: 'Тренер 2',
          clients: []
        },
        {
          id: '3',
          name: 'Full Body 3',
          color: getProgramColor(2),
          trainer: 'Тренер 3',
          clients: []
        }
      ];
      
      // Тестовые клиенты
      const allClients = getAllClients();
      if (allClients.length > 0) {
        // Распределяем реальных клиентов
        const clientsPerProgram = Math.min(8, Math.floor(allClients.length / 3));
        testPrograms.forEach((program, index) => {
          const startIndex = index * clientsPerProgram;
          const endIndex = Math.min(startIndex + clientsPerProgram, allClients.length);
          const programClients = allClients.slice(startIndex, endIndex);
          
          const stationSequence = getStationSequenceForProgram(index);
          
          program.clients = programClients.map((client, clientIndex) => ({
            ...client,
            order: clientIndex,
            currentStation: stationSequence[currentStationIndex % stationSequence.length],
            nextStation: stationSequence[(currentStationIndex + 1) % stationSequence.length],
            hasTransition: true,
            programIndex: index
          }));
        });
      } else {
        // Создаём тестовых клиентов
        const program1Names = ['Марина', 'Анна', 'Елена', 'Ольга'];
        const program2Names = ['Ирина', 'Наталья', 'Татьяна', 'Светлана'];
        const program3Names = ['Юлия', 'Мария', 'Александра', 'Екатерина'];
        
        const programNames = [program1Names, program2Names, program3Names];
        
        testPrograms.forEach((program, index) => {
          const stationSequence = getStationSequenceForProgram(index);
          
          program.clients = programNames[index].map((name, clientIndex) => ({
            id: `test-${index + 1}-${clientIndex + 1}`,
            name: `${name} ${clientIndex + 1}`,
            order: clientIndex,
            currentStation: stationSequence[currentStationIndex % stationSequence.length],
            nextStation: stationSequence[(currentStationIndex + 1) % stationSequence.length],
            hasTransition: true,
            programIndex: index
          }));
        });
      }
      
      console.log('✅ Тестовые данные 3 программ:', testPrograms);
      setProgramsData(testPrograms);
    }
  }, [getAllClients, currentStationIndex, hitZoneData]);
  
  // Функция для получения цвета программы по индексу
  const getProgramColor = (index) => {
    const colors = ['#4361EE', '#F6BD60', '#56CFE1']; // Синий, желтый, голубой
    return colors[index % colors.length];
  };
  
  // Функция для получения последовательности станций для программы
  const getStationSequenceForProgram = (programIndex) => {
    // Для 3 программ используем разные префиксы станций
    const prefixes = ['A', 'B', 'C'];
    const prefix = prefixes[programIndex % prefixes.length];
    
    return Array.from({ length: 8 }, (_, i) => `${i + 1}${prefix}`);
  };
  
  // Логика прогресс-бара станций для 3 программ
  const getStationStatus = (stationNumber) => {
    // stationNumber: 1-8
    // currentStationIndex: 0-7
    
    if (stationNumber < currentStationIndex + 1) {
      return 'active-p9-2'; // Уже пройденные станции
    } else if (stationNumber === currentStationIndex + 1) {
      return 'current-p9-2'; // Текущая станция
    } else {
      return 'inactive-p9-2'; // Будущие станции
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
          padding: '20px',
          gridColumn: '1 / span 2'
        }}>
          Нет клиентов в программе
        </div>
      );
    }
    
    // Для 3 программ показываем максимум 8 клиентов в 2 колонках
    const half = Math.ceil(program.clients.length / 2);
    const leftColumn = program.clients.slice(0, half);
    const rightColumn = program.clients.slice(half);
    
    return (
      <>
        <div className="frame-38-inner-p9-2">
          {leftColumn.map((client, index) => {
            const bgClass = index % 4;
            let frameClass;
            switch(bgClass) {
              case 0: frameClass = 'frame-54-nested-p9-2'; break;
              case 1: frameClass = 'frame-52-nested-p9-2'; break;
              case 2: frameClass = 'frame-37-nested-p9-2'; break;
              case 3: frameClass = 'frame-55-nested-p9-2'; break;
              default: frameClass = 'frame-54-nested-p9-2';
            }
            
            return (
              <div key={`${client.id}-${index}`} className={frameClass}>
                <div className="frame-46-p9-2">
                  <div className="frame-58-p9-2">
                    <div className="frame-10-p9-2">
                      <div className="image-placeholder-p9-2"></div>
                      <div className="text-marina-p9-2">{client.name}</div>
                    </div>
                    <div className="frame-26-p9-2">
                      <div className="text-2a-p9-2">{client.currentStation}</div>
                      
                      {client.hasTransition && (
                        <div className="frame-45-p9-2">
                          <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p9-2" />
                        </div>
                      )}
                      
                      <div className="text-2d-p9-2">{client.nextStation}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="frame-40-p9-2">
          {rightColumn.map((client, index) => {
            const bgClass = (index + half) % 4;
            let frameClass;
            switch(bgClass) {
              case 0: frameClass = 'frame-54-nested-p9-2'; break;
              case 1: frameClass = 'frame-52-nested-p9-2'; break;
              case 2: frameClass = 'frame-37-nested-p9-2'; break;
              case 3: frameClass = 'frame-55-nested-p9-2'; break;
              default: frameClass = 'frame-54-nested-p9-2';
            }
            
            return (
              <div key={`${client.id}-${index + half}`} className={frameClass}>
                <div className="frame-46-p9-2">
                  <div className="frame-58-p9-2">
                    <div className="frame-10-p9-2">
                      <div className="image-placeholder-p9-2"></div>
                      <div className="text-marina-p9-2">{client.name}</div>
                    </div>
                    <div className="frame-26-p9-2">
                      <div className="text-2a-p9-2">{client.currentStation}</div>
                      
                      {client.hasTransition && (
                        <div className="frame-45-p9-2">
                          <img src={ArrowDouble} alt=">>" className="arrow-double-icon-p9-2" />
                        </div>
                      )}
                      
                      <div className="text-2d-p9-2">{client.nextStation}</div>
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
        Загрузка данных для 3 программ...
      </div>
    );
  }
  
  return (
    <div className="page page-2-p9-2">
      <div className="frame-38-p9-2">
        <div className="logo-p9-2">
          <img src={Logo} alt="Логотип" className="logo-image-p9-2" />
        </div>
      </div>
      
      <div className="frame-37-p9-2">
        <div className="frame-28-p9-2">
          <div className="frame-27-p9-2">
            {/* Программа 1 */}
            <div className="frame-52-p9-2">
              <div className="frame-14-p9-2">
                <div className="frame-54-inner-p9-2">
                  <div className="text-full-body-1-p9-2">
                    {programsData[0]?.name || 'Full Body 1'}
                  </div>
                </div>
              </div>
              <div className="frame-55-p9-2">
                <div className="frame-47-p9-2">
                  {renderProgramColumn(programsData[0])}
                </div>
              </div>
            </div>
            
            {/* Программа 2 */}
            <div className="frame-53-p9-2">
              <div className="frame-14-p9-2">
                <div className="frame-54-inner-p9-2">
                  <div className="text-full-body-2-p9-2">
                    {programsData[1]?.name || 'Full Body 2'}
                  </div>
                </div>
              </div>
              <div className="frame-55-p9-2">
                <div className="frame-47-p9-2">
                  {renderProgramColumn(programsData[1])}
                </div>
              </div>
            </div>
            
            {/* Программа 3 */}
            <div className="frame-54-p9-2">
              <div className="frame-14-p9-2">
                <div className="frame-54-inner-p9-2">
                  <div className="text-full-body-3-p9-2">
                    {programsData[2]?.name || 'Full Body 3'}
                  </div>
                </div>
              </div>
              <div className="frame-55-p9-2">
                <div className="frame-47-p9-2">
                  {renderProgramColumn(programsData[2])}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-1-p9-2">
        <div className="frame-29-p9-2">
          <img src={ShuffleIcon} alt="Shuffle" className="shuffle-icon-p9-2" />
          <div className="text-transition-p9-2">Переход</div>
        </div>
        
        <div className="frame-2-p9-2">
          <div className="frame-16-p9-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
              const status = getStationStatus(number);
              console.log(`📊 Станция ${number}: ${status}`);
              return (
                <div key={number} className={`step-number-p9-2 ${status}`}>
                  {number}
                </div>
              );
            })}
          </div>
          
          <div className="frame-18-p9-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
              const status = getStationStatus(number);
              return <div key={number} className={`progress-step-p9-2 ${status}`}></div>;
            })}
          </div>
        </div>
        
        <div className="frame-30-p9-2">
          <img src={TimerIcon} alt="Timer" className="timer-icon-p9-2" />
          <div className="text-timer-p9-2">{formatTime(timer)}</div>
        </div>
      </div>
    </div>
  );
};

export default TransitionPage3;