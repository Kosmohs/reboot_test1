// page1_1.jsx - ФИНАЛЬНАЯ ВЕРСИЯ (уникальные клиенты с первой станцией)
import './Page1_1.css';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import schemeParser from '../utils/scheme-parser';

function Page11() {
  const location = useLocation();
  const hitZoneData = location.state?.hitZoneData || {};
  
  const [clients, setClients] = useState([]);
  const [trainingData, setTrainingData] = useState(null);
  const [currentTime, setCurrentTime] = useState(120);
  const [currentRound, setCurrentRound] = useState(1);
  const timerRef = useRef(null);
  
  // Инициализация данных
  useEffect(() => {
    // Проверка что данные есть
    if (!hitZoneData || !hitZoneData.success || !hitZoneData.Scheme) {
      console.log('⏳ Ожидание данных...');
      return;
    }
    
    console.log('🎯 === PAGE1_1 ЗАГРУЗКА ===');
    
    // 1. Анализируем данные Scheme
    console.log('\n📊 ШАГ 1: АНАЛИЗ ДАННЫХ SCHEME');
    schemeParser.analyzeScheme(hitZoneData.Scheme);
    
    // 2. Получаем УНИКАЛЬНЫХ клиентов с их ПЕРВОЙ станцией
    console.log('\n🎯 ШАГ 2: ПОЛУЧЕНИЕ УНИКАЛЬНЫХ КЛИЕНТОВ');
    
    // Берем первый раунд
    const firstRound = hitZoneData.Scheme[0] || [];
    console.log(`Первый раунд содержит ${firstRound.length} записей`);
    
    // Собираем уникальных клиентов (первые записи для каждого client_id)
    const uniqueClientsMap = new Map();
    const clientStations = {}; // Для логирования - все станции каждого клиента
    
    firstRound.forEach((item, index) => {
      if (!item.client_id) return;
      
      // Логируем все записи для отладки
      if (!clientStations[item.client_id]) {
        clientStations[item.client_id] = [];
      }
      clientStations[item.client_id].push({
        station: item.station_number,
        training_id: item.training_id,
        index: index
      });
      
      // Сохраняем только первую запись для каждого клиента
      if (!uniqueClientsMap.has(item.client_id)) {
        uniqueClientsMap.set(item.client_id, {
          id: item.client_id,
          name: item.client_name || 'Клиент',
          station: item.station_number || '', // ПЕРВАЯ станция
          training_id: item.training_id,
          order: uniqueClientsMap.size, // Порядок первого появления
          raw: item
        });
      }
    });
    
    // Преобразуем Map в массив
    const uniqueClients = Array.from(uniqueClientsMap.values())
      .slice(0, 8); // Берем максимум 8 клиентов
    
    // 3. Логируем информацию о клиентах и их станциях
    console.log('\n🔍 ИНФОРМАЦИЯ О КЛИЕНТАХ:');
    console.log(`Всего уникальных клиентов в раунде: ${uniqueClientsMap.size}`);
    console.log(`Будет отображено: ${uniqueClients.length}`);
    
    // Логируем очереди станций для каждого клиента (только для отладки)
    Object.entries(clientStations).forEach(([clientId, stations]) => {
      const clientName = firstRound.find(item => item.client_id === clientId)?.client_name;
      console.log(`\n👤 ${clientName} (ID: ${clientId}):`);
      console.log(`   Всего станций в очереди: ${stations.length}`);
      stations.forEach((s, i) => {
        console.log(`   ${i + 1}. Станция ${s.station} (training_id: ${s.training_id})`);
      });
    });
    
    console.log('\n✅ Клиенты для отображения (только с первой станцией):');
    uniqueClients.forEach((client, i) => {
      console.log(`   ${i + 1}. ${client.name} → Станция ${client.station}`);
    });
    
    // 4. Устанавливаем state
    setClients(uniqueClients);
    
    // 5. Устанавливаем данные тренировки
    setTrainingData({
      name: hitZoneData.trainingInfo?.name || 'Тренировка',
      trainer: hitZoneData.trainingInfo?.trainer || 'Тренер',
      round: 1,
      totalRounds: 8,
      currentApproach: hitZoneData.trainingInfo?.currentApproach || 1
    });
    
    console.log('🎯 === ЗАГРУЗКА ЗАВЕРШЕНА ===\n');
    
  }, [hitZoneData]);
  
  // Таймер
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (trainingData) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => prev <= 0 ? 0 : prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [trainingData]);
  
  // Функция для распределения клиентов по колонкам
  const distributeClientsToColumns = () => {
    if (clients.length <= 4) {
      return { leftColumn: clients, rightColumn: [] };
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
  
  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Отображаем статус данных только в консоли
  useEffect(() => {
    if (clients.length > 0) {
      console.log('📊 ФИНАЛЬНЫЕ ДАННЫХ ДЛЯ ОТОБРАЖЕНИЯ:');
      console.log(`- Всего клиентов: ${clients.length}`);
      console.log('- Каждый клиент отображается только с ПЕРВОЙ станцией');
      clients.forEach((client, i) => {
        console.log(`  ${i + 1}. ${client.name} - Станция: ${client.station}`);
      });
    }
  }, [clients]);
  
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
              if (number < currentRound) className += 'active-p11';
              else if (number === currentRound) className += 'current-p11';
              else className += 'inactive-p11';
              
              return (
                <div key={number} className={className}>{number}</div>
              );
            })}
          </div>
          
          <div className="frame-18-p11">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
              let className = 'progress-step-p11 ';
              if (number < currentRound) className += 'active-p11';
              else if (number === currentRound) className += 'current-p11';
              else className += 'inactive-p11';
              
              return <div key={number} className={className}></div>;
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