// src/components/training-flow/TrainingStateProvider.jsx
import { createContext, useState, useContext, useMemo, useEffect, useCallback } from 'react';

// Создаём контекст
export const TrainingStateContext = createContext();

// Хук для использования контекста в компонентах
export const useTrainingState = () => {
  const context = useContext(TrainingStateContext);
  if (!context) {
    throw new Error('useTrainingState must be used within TrainingStateProvider');
  }
  return context;
};

export const TrainingStateProvider = ({ children, hitZoneData }) => {
  console.log('🎯 TrainingStateProvider инициализация:', {
    hasHitZoneData: !!hitZoneData,
    success: hitZoneData?.success,
    hasScheme: hitZoneData?.Scheme?.length > 0,
    schemeLength: hitZoneData?.Scheme?.length,
    layout: hitZoneData?.layout, // Добавили layout в логи
    programCount: hitZoneData?.programCount,
    clientCount: hitZoneData?.clientCount
  });

  // --- БАЗОВЫЕ СОСТОЯНИЯ ---
  
  // Текущий этап: 1=разминка, 2=начало, 3=выполнение, 4=отдых, 5=переход, 6=окончание
  const [currentStep, setCurrentStep] = useState(1);
  
  // Текущий индекс станции (0-7, всего 8 станций)
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  
  // Текущий подход (1-4)
  const [currentApproach, setCurrentApproach] = useState(1);
  
  // Статус таймера (идет/остановлен)
  const [isRunning, setIsRunning] = useState(true);
  
  // Текущее время таймера
  const [timer, setTimer] = useState(0);
  
  // --- ДАННЫЕ ИЗ API ---
  
  // Scheme данные (ВАЖНО: должен быть объявлен до функций, которые его используют)
  const scheme = useMemo(() => {
    return hitZoneData?.Scheme || [];
  }, [hitZoneData]);
  
  // Определяем layout на основе данных
  const currentLayout = useMemo(() => {
    // 1. Если layout явно указан в hitZoneData
    if (hitZoneData?.layout) {
      return hitZoneData.layout;
    }
    
    // 2. Определяем логически по programCount и clientCount
    const programCount = hitZoneData?.programCount || 1;
    const clientCount = hitZoneData?.clientCount || 0;
    const hasAllPrograms = hitZoneData?.allPrograms?.length > 0;
    
    console.log('🔍 Определение layout:', {
      programCount,
      clientCount,
      hasAllPrograms,
      allProgramsLength: hitZoneData?.allPrograms?.length
    });
    
    if (hasAllPrograms && programCount === 3) {
      return 'page1'; // 3 программы
    }
    
    if (hasAllPrograms && programCount === 2) {
      return 'page1_3'; // 2 программы
    }
    
    // Для одной программы
    if (programCount === 1) {
      return clientCount <= 12 ? 'page1_1' : 'page1_2';
    }
    
    // Дефолтный layout
    return 'page1_1';
  }, [hitZoneData]);
  
  console.log('🎯 Определен layout:', currentLayout);
  
  // Конфигурация тренировки
  const trainingConfig = useMemo(() => {
    if (!hitZoneData || !hitZoneData.success) {
      return {
        name: 'Тренировка',
        warmup_time: 60,
        exercise_time: 60,
        rest_time: 60,
        transition_time: 60,
        number_of_approaches: 4
      };
    }
    
    // Основная тренировка из allPrograms
    const mainTraining = hitZoneData.allPrograms?.[0] || {};
    
    return {
      name: hitZoneData.trainingInfo?.name || 'Тренировка',
      warmup_time: mainTraining.training?.warmup_time || 60,
      exercise_time: mainTraining.training?.exercise_time || 45,
      rest_time: mainTraining.training?.rest_time || 15,
      transition_time: mainTraining.training?.transition_time || 30,
      number_of_approaches: 4 // Пока фиксировано, потом возьмём из данных
    };
  }, [hitZoneData]);
  
  console.log('📊 Конфигурация тренировки:', trainingConfig);
  console.log('📊 Scheme данных:', scheme.length, 'раундов');
  
  // --- ФУНКЦИИ ДЛЯ РАБОТЫ С ДАННЫМИ ---
  
  // Получить ВСЕХ уникальных клиентов с их первой станцией
  const getAllClients = useCallback(() => {
    if (!scheme.length) {
      console.log('⚠️ Scheme пустой, не могу получить клиентов');
      return [];
    }
    
    console.log('👥 Получение всех клиентов из Scheme...');
    const firstRound = scheme[0] || [];
    const uniqueClientsMap = new Map();
    
    firstRound.forEach((item, index) => {
      if (!item.client_id) return;
      
      if (!uniqueClientsMap.has(item.client_id)) {
        uniqueClientsMap.set(item.client_id, {
          id: item.client_id,
          name: item.client_name || 'Клиент',
          station: item.station_number || '',
          training_id: item.training_id,
          order: uniqueClientsMap.size,
          raw: item
        });
      }
    });
    
    const clients = Array.from(uniqueClientsMap.values()).slice(0, 8);
    console.log(`✅ Получено ${clients.length} клиентов:`, clients.map(c => c.name));
    return clients;
  }, [scheme]);
  
  // Получить ВСЕ станции клиента в порядке очереди
  const getClientStations = useMemo(() => {
    return (clientId) => {
      if (!scheme.length || !clientId) return [];
      
      const stations = [];
      
      // Проходим по всем раундам
      scheme.forEach(round => {
        // В каждом раунде ищем записи для этого клиента
        round.forEach(item => {
          if (item.client_id === clientId) {
            stations.push({
              station: item.station_number,
              training_id: item.training_id,
              training_name: item.training?.name,
              station_id: item.station_id
            });
          }
        });
      });
      
      // Убираем дубликаты станций, сохраняя порядок первого появления
      const uniqueStations = [];
      const seen = new Set();
      
      stations.forEach(station => {
        if (!seen.has(station.station)) {
          seen.add(station.station);
          uniqueStations.push(station);
        }
      });
      
      console.log(`👤 Станции клиента ${clientId}:`, uniqueStations.length, 'станций');
      return uniqueStations;
    };
  }, [scheme]);
  
  // Получить текущую станцию для клиента
  const getCurrentStationForClient = useMemo(() => {
    return (clientId) => {
      const stations = getClientStations(clientId);
      if (stations.length === 0 || currentStationIndex >= stations.length) {
        return null;
      }
      return stations[currentStationIndex];
    };
  }, [getClientStations, currentStationIndex]);
  
  // Получить следующую станцию для клиента (для перехода)
  const getNextStationForClient = useMemo(() => {
    return (clientId) => {
      const stations = getClientStations(clientId);
      if (stations.length === 0 || currentStationIndex + 1 >= stations.length) {
        return null;
      }
      return stations[currentStationIndex + 1];
    };
  }, [getClientStations, currentStationIndex]);
  
  // --- ЛОГИКА ПЕРЕХОДА МЕЖДУ ЭТАПАМИ ---
  
  const goToNextStep = useCallback(() => {
    console.log('🔄 Переход к следующему шагу:', {
      currentStep,
      currentStationIndex,
      currentApproach
    });
    
    switch(currentStep) {
      case 1: // Разминка → Начало
        console.log('✅ Разминка завершена → Переход к началу');
        setCurrentStep(2);
        break;
        
      case 2: // Начало → Выполнение (1й подход)
        console.log('✅ Начало завершено → Первый подход');
        setCurrentStep(3);
        setCurrentApproach(1);
        break;
        
      case 3: // Выполнение → Отдых
        console.log('✅ Выполнение завершено → Отдых');
        setCurrentStep(4);
        break;
        
      case 4: // Отдых → проверяем что дальше
        console.log('✅ Отдых завершен, проверяем логику...', {
          currentApproach,
          numberOfApproaches: trainingConfig.number_of_approaches,
          currentStationIndex
        });
        
        if (currentApproach < trainingConfig.number_of_approaches) {
          // Ещё не все подходы выполнены → следующий подход
          const nextApproach = currentApproach + 1;
          console.log(`🔄 Ещё подходы: ${currentApproach} → ${nextApproach}`);
          setCurrentApproach(nextApproach);
          setCurrentStep(3); // Возвращаемся к выполнению
        } else {
          // Все подходы выполнены → проверяем станции
          if (currentStationIndex < 7) { // Всего 8 станций (0-7)
            // Ещё не все станции пройдены → переход к следующей станции
            const nextStation = currentStationIndex + 1;
            console.log(`🔄 Переход к станции ${nextStation + 1}`);
            setCurrentStationIndex(nextStation);
            setCurrentApproach(1); // Сбрасываем счётчик подходов
            setCurrentStep(5); // Переход между станциями
          } else {
            // Все станции пройдены → конец тренировки
            console.log('🏁 Все станции пройдены → Окончание тренировки');
            setCurrentStep(6);
          }
        }
        break;
        
      case 5: // Переход → Выполнение (новая станция)
        console.log('✅ Переход завершен → Выполнение новой станции');
        setCurrentStep(3);
        break;
        
      default:
        console.log('⚠️ Неизвестный шаг:', currentStep);
        break;
    }
  }, [currentStep, currentStationIndex, currentApproach, trainingConfig.number_of_approaches]);
  
  // --- ТАЙМЕР ---
  
  // Устанавливаем время таймера в зависимости от текущего шага
  useEffect(() => {
    let timeForStep = 0;
    
    switch(currentStep) {
      case 1: // Разминка
        timeForStep = trainingConfig.warmup_time;
        break;
      case 2: // Начало/переход к станциям
        timeForStep = trainingConfig.transition_time;
        break;
      case 3: // Выполнение
        timeForStep = trainingConfig.exercise_time;
        break;
      case 4: // Отдых
        timeForStep = trainingConfig.rest_time;
        break;
      case 5: // Переход между станциями
        timeForStep = trainingConfig.transition_time;
        break;
      default:
        timeForStep = 0;
    }
    
    console.log(`⏱️ Установка таймера для шага ${currentStep}: ${timeForStep} сек`);
    setTimer(timeForStep);
  }, [currentStep, trainingConfig]);
  
  // Запуск/остановка таймера
  useEffect(() => {
    if (!isRunning || currentStep === 6) return; // Не запускаем на последнем шаге
    
    const intervalId = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          // Время закончилось
          clearInterval(intervalId);
          setTimeout(() => goToNextStep(), 100); // Небольшая задержка перед переходом
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [isRunning, currentStep, goToNextStep]);
  
  // --- ФОРМИРУЕМ ЗНАЧЕНИЕ ДЛЯ КОНТЕКСТА ---
  
  const value = useMemo(() => ({
    // Состояния
    currentStep,
    currentStationIndex,
    currentApproach,
    timer,
    isRunning,
    
    // Layout - ДОБАВЛЯЕМ ЭТО
    currentLayout,
    
    // Конфигурация
    trainingConfig,
    scheme,
    
    // Методы работы с данными
    getAllClients,
    getClientStations,
    getCurrentStationForClient,
    getNextStationForClient,
    
    // Методы управления
    goToNextStep,
    pauseTraining: () => {
      console.log('⏸️ Пауза тренировки');
      setIsRunning(false);
    },
    resumeTraining: () => {
      console.log('▶️ Продолжение тренировки');
      setIsRunning(true);
    },
    skipToNext: () => {
      console.log('⏭️ Пропуск текущего шага');
      goToNextStep();
    },
    
    // Управление состоянием (для отладки)
    setCurrentStep,
    setCurrentStationIndex,
    setCurrentApproach
  }), [
    currentStep,
    currentStationIndex,
    currentApproach,
    timer,
    isRunning,
    currentLayout, // ДОБАВЛЯЕМ ЭТО
    trainingConfig,
    scheme,
    getAllClients,
    getClientStations,
    getCurrentStationForClient,
    getNextStationForClient,
    goToNextStep
  ]);
  
  return (
    <TrainingStateContext.Provider value={value}>
      {children}
    </TrainingStateContext.Provider>
  );
};