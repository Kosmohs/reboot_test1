// page1_1.jsx - ИСПРАВЛЕННАЯ ВЕРСИЯ (без бесконечного цикла)
import './Page1_1.css';
import Logo from '../assets/images/logo.svg';
import TimerIcon from '../assets/images/timer.svg';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageData, getClientsFromScheme } from '../utils/scheme-parser';
import schemeParser from '../utils/scheme-parser';


console.log('🔴🔴🔴 THIS IS PAGE1_1.jsx 🔴🔴🔴');

function Page11() {
  const location = useLocation();
  const hitZoneData = location.state?.hitZoneData || {};

  const [pageData, setPageData] = useState(null);
  
  // ВАЖНО: Создаем стабильную ссылку на данные
  const stableHitZoneData = useMemo(() => {
    const data = location.state?.hitZoneData;
    if (!data) return { success: false };
    
    // Возвращаем только необходимые поля
    return {
      success: data.success,
      trainingInfo: data.trainingInfo,
      Scheme: data.Scheme,
      clients: data.clients
    };
  }, [
    location.state?.hitZoneData?.success,
    location.state?.hitZoneData?.trainingInfo?.name,
    // Используем JSON.stringify для массива как зависимость
    JSON.stringify(location.state?.hitZoneData?.Scheme?.[0] || []),
    JSON.stringify(location.state?.hitZoneData?.clients || [])
  ]);
  
  const [trainingData, setTrainingData] = useState(null);
  const [clients, setClients] = useState([]);
  const [currentTime, setCurrentTime] = useState(120);
  const [currentRound, setCurrentRound] = useState(1);
  const timerRef = useRef(null);
  const processedRef = useRef(false);

  // console.log('📦 Page11: Рендер компонента (стабильный)');

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

  // ЭФФЕКТ ДЛЯ ОБРАБОТКИ ДАННЫХ - ВЫПОЛНЯЕТСЯ ОДИН РАЗ
  // САМЫЙ ПРОСТОЙ ВАРИАНТ - без useMemo
  // const hitZoneData = location.state?.hitZoneData || {};
  const [isInitialized, setIsInitialized] = useState(false);

  // useEffect(() => {
  //   // Если уже инициализировали или нет данных
  //   if (isInitialized || !hitZoneData.success) {
  //     return;
  //   }
    
  //   console.log('✅ Инициализирую с реальными данными');
  //   setIsInitialized(true);
    
  //   // Обрабатываем данные...
  //   setTrainingData({
  //     name: hitZoneData.trainingInfo?.name || 'Steppe Burn',
  //     trainer: hitZoneData.trainingInfo?.trainer || 'Тренер',
  //     round: 1,
  //     totalRounds: 16,
  //     currentApproach: 1,
  //   });
    
  //   if (hitZoneData.Scheme?.[0]) {
  //     const firstRound = hitZoneData.Scheme[0];
  //     const clientMap = new Map();
      
  //     firstRound.forEach(item => {
  //       if (item.client_id && !clientMap.has(item.client_id)) {
  //         clientMap.set(item.client_id, {
  //           id: item.client_id,
  //           name: item.client_name,
  //           station: item.station_number
  //         });
  //       }
  //     });
      
  //     const clientList = Array.from(clientMap.values());
  //     setClients(clientList);
  //   }
    
  // }, [hitZoneData, isInitialized]);







  // useEffect(() => {
  //   if (!hitZoneData.success) return;

  //   console.log('=== ПРОВЕРКА КЭША ===');
  //   console.log('Есть кэш?', !!localStorage.getItem('hit_zone_data_cache'));
    
  //   // Функция проверки кэша
  //   const checkIfCacheExpired = () => {
  //     const cached = localStorage.getItem('hit_zone_data_cache');
  //     if (!cached) return true;
      
  //     try {
  //       const { timestamp } = JSON.parse(cached);
  //       const isExpired = Date.now() - timestamp > 15 * 60 * 1000;
  //       console.log('Кэш создан:', new Date(timestamp).toLocaleTimeString());
  //       console.log('Устарел?', isExpired);
  //       return isExpired;
  //     } catch {
  //       return true;
  //     }
  //   };
    
  //   console.log('Кэш устарел?', checkIfCacheExpired());
    
  //   // Получаем данные для page1_1
  //   const data = getPageData('page1_1', hitZoneData);
  //   console.log('📊 Данные для page1_1:', data);

  //   // Просто добавьте этот код в ваш useEffect:
  //   console.log('🔍 АНАЛИЗ ДАННЫХ SCHEME:');
  //   console.log('Структура Scheme:', hitZoneData.Scheme);

  //   if (hitZoneData.Scheme && hitZoneData.Scheme.length > 0) {
  //     const firstRound = hitZoneData.Scheme[0];
  //     console.log(`Первый раунд (${firstRound.length} записей):`);
      
  //     // Выводим порядок станций как они идут в массиве
  //     console.log('🔢 ПОРЯДОК СТАНЦИЙ В МАССИВЕ:');
  //     firstRound.forEach((item, index) => {
  //       console.log(`[${index}] ${item.client_name} → ${item.station_number} (training_id: ${item.training_id})`);
  //     });
      
  //     // Группируем по client_id
  //     const clientsMap = new Map();
  //     firstRound.forEach(item => {
  //       if (!clientsMap.has(item.client_id)) {
  //         clientsMap.set(item.client_id, []);
  //       }
  //       clientsMap.get(item.client_id).push(item.station_number);
  //     });
      
  //     console.log('👤 КЛИЕНТЫ И ИХ СТАНЦИИ:');
  //     clientsMap.forEach((stations, clientId) => {
  //       const clientName = firstRound.find(item => item.client_id === clientId)?.client_name;
  //       console.log(`${clientName}: ${stations.join(', ')}`);
  //     });
  //   }
    
  //   setPageData(data);
  //   setTrainingData({
  //     name: data.name,
  //     trainer: data.trainer,
  //     round: data.round,
  //     totalRounds: data.totalRounds,
  //     currentApproach: data.currentApproach
  //   });
    
  //   // Или просто берем клиентов напрямую
  //   const clientsList = getClientsFromScheme(hitZoneData.Scheme, {
  //     trainingId: data.program?.training_id,
  //     round: data.round,
  //     uniqueOnly: true,
  //     sortBy: 'order'
  //   });
    
  //   setClients(clientsList);
    
  // }, [hitZoneData]);






  // // В useEffect, вместо getPageData или вместе с ним:
  // useEffect(() => {
  //   if (!hitZoneData.success || !hitZoneData.Scheme) return;
    
  //   console.log('🔍 Использую новую логику с unique training_id');
    
  //   // Получаем станции по уникальным training_id
  //   const stations = schemeParser.getStationsByUniqueTraining(hitZoneData.Scheme, {
  //     maxTrainingIds: 8,
  //     sortBy: 'appearance' // 'appearance', 'training_id', или 'station'
  //   });
    
  //   // Преобразуем в формат для отображения
  //   const displayClients = stations.map((station, index) => ({
  //     id: `station_${station.training_id}_${index}`,
  //     name: station.clientName,
  //     station: station.station,
  //     training_id: station.training_id,
  //     training_name: station.training_name,
  //     order: index
  //   }));
    
  //   console.log('👥 Клиенты для отображения:', displayClients);
    
  //   // Устанавливаем данные
  //   setClients(displayClients);
    
  //   // Также установите trainingData если нужно
  //   setTrainingData({
  //     name: hitZoneData.trainingInfo?.name || 'Steppe Burn',
  //     trainer: hitZoneData.trainingInfo?.trainer || 'Тренер',
  //     round: 1,
  //     totalRounds: 8, // Теперь 8 вместо 16?
  //     currentApproach: 1
  //   });
    
  // }, [hitZoneData]);




  // Page1_1.jsx - полный useEffect
  useEffect(() => {
    // Проверка что данные есть
    if (!hitZoneData || !hitZoneData.success || !hitZoneData.Scheme) {
      console.log('⏳ Ожидание данных...');
      return;
    }
    
    console.log('🎯 === PAGE1_1 ЗАГРУЗКА ===');
    
    // 1. Анализируем все training_id
    console.log('\n📊 ШАГ 1: АНАЛИЗ ДАННЫХ');
    schemeParser.analyzeAllTrainingIds(hitZoneData.Scheme);
    
    // 2. Получаем 8 уникальных станций
    console.log('\n🎯 ШАГ 2: ПОЛУЧЕНИЕ 8 СТАНЦИЙ');
    const stations = schemeParser.getStationsByUniqueTraining(hitZoneData.Scheme, {
      maxTrainingIds: 8,
      sortBy: 'roundThenStation' // Порядок первого появления в данных
    });
    
    // 3. Обрабатываем результат
    console.log('\n👥 ШАГ 3: ПОДГОТОВКА К ОТОБРАЖЕНИЮ');
    
    if (!stations || stations.length === 0) {
      console.error('❌ Не удалось получить станции!');
      
      // Fallback: старая логика
      const pageData = schemeParser.getPageData('page1_1', hitZoneData);
      if (pageData.clients) {
        console.log('🔄 Использую старую логику как fallback');
        setClients(pageData.clients);
        setTrainingData({
          name: pageData.name,
          trainer: pageData.trainer,
          round: pageData.round,
          totalRounds: pageData.totalRounds,
          currentApproach: pageData.currentApproach
        });
      }
      return;
    }
    
    // 4. Преобразуем в формат клиентов
    const displayClients = stations.map((station, index) => ({
      id: `training_${station.training_id}`,
      name: station.clientName,
      station: station.station,
      training_id: station.training_id,
      training_name: station.training_name,
      displayOrder: index + 1 // 1-8
    }));
    
    console.log('✅ Готово к отображению:', displayClients);
    
    // 5. Устанавливаем state
    setClients(displayClients);
    
    // 6. Устанавливаем данные тренировки
    setTrainingData({
      name: hitZoneData.trainingInfo?.name || 'Тренировка',
      trainer: hitZoneData.trainingInfo?.trainer || 'Тренер',
      round: 1,
      totalRounds: 8, // Всего 8 станций/упражнений
      currentApproach: hitZoneData.trainingInfo?.currentApproach || 1
    });
    
    console.log('🎯 === ЗАГРУЗКА ЗАВЕРШЕНА ===\n');
    
  }, [hitZoneData]); // Зависимость от hitZoneData





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

  // ДЕБАГ: Показываем статус данных
  const renderDataStatus = () => {
    if (stableHitZoneData.Scheme && stableHitZoneData.Scheme.length > 0) {
      return (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: '#4CAF50',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '5px',
          fontSize: '16px',
          fontWeight: 'bold',
          zIndex: 1000,
          border: '2px solid white',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)'
        }}>
          ✅ РЕАЛЬНЫЕ ДАННЫЕ API
          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            Клиентов: {clients.length}, Станция: {clients[0]?.station}
          </div>
        </div>
      );
    }
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#FF9800',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        zIndex: 1000,
        border: '2px solid white',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)'
      }}>
        ⚠️ ТЕСТОВЫЕ ДАННЫЕ
      </div>
    );
  };

  // Отладочная информация
  const renderDebugInfo = () => {
    return (
      <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        maxWidth: '300px',
        zIndex: 1000
      }}>
        <div><strong>Отладка:</strong></div>
        <div>Обработано: {processedRef.current ? '✅' : '❌'}</div>
        <div>Клиентов: {clients.length}</div>
        {clients.map((client, i) => (
          <div key={i}>
            {client.name} - {client.station}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="page page-7-p11">
      {renderDataStatus()}
      {renderDebugInfo()}
      
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