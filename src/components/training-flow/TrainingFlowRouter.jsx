// src/components/training-flow/TrainingFlowRouter.jsx
import { useTrainingState } from './TrainingStateProvider';
import WarmupPage from './WarmupPage';
import StartPage from './StartPage';
import StartPage1 from './StartPage1';
import StartPage2 from './StartPage2';
import StartPage3 from './StartPage3';
import ExercisePage from './ExercisePage';
import RestPage from './RestPage';
import TransitionPage from './TransitionPage';
import TransitionPage1 from './TransitionPage1';
import TransitionPage2 from './TransitionPage2';
import TransitionPage3 from './TransitionPage3';
import FinishPage from './FinishPage';
import { formatTime } from '../../utils/training-calculator';
import { useState, useEffect } from 'react';


const TrainingFlowRouter = () => {
  const { 
    currentStep, 
    currentLayout, 
    trainingInProgress, 
    calculatedState,
    timer,
    setTimer
  } = useTrainingState();

  // Новое состояние для отображения плашки
  const [showProgressInfo, setShowProgressInfo] = useState(false);
  
  // console.log('🔄 TrainingFlowRouter:', {
  //   шаг: currentStep, 
  //   layout: currentLayout,
  //   тренировка_идёт: trainingInProgress,
  //   рассчитанное_состояние: calculatedState,
  //   текущий_таймер: timer
  // });

  // // После получения данных из useTrainingState
  // console.log('📊 ВСЕ ДАННЫЕ useTrainingState:', {
  //   currentStep,
  //   currentLayout,
  //   trainingInProgress,
  //   calculatedState,
  //   timer
  // });

  // // Особенно подробно calculatedState
  // console.log('🔍 calculatedState объект:', calculatedState);
  // if (calculatedState) {
  //   console.log('📋 calculatedState ключи:', Object.keys(calculatedState));
  //   console.log('🔄 calculatedState значения:', calculatedState);
  // }

  const trainingState = useTrainingState();
  // console.log('🏗️ ВСЕ данные из useTrainingState:', trainingState);
  // console.log('🔑 Все ключи:', Object.keys(trainingState));

  // Разложи на отдельные переменные чтобы увидеть все
  const {
    // currentStep,
    // currentLayout,
    // trainingInProgress,
    // calculatedState,
    // timer,
    // setTimer,
    // возможно есть другие
    ...rest
  } = trainingState;

  // console.log('📦 Остальные данные из useTrainingState:', rest);

  
  // Эффект для синхронизации таймера с рассчитанным состоянием
  useEffect(() => {
    if (trainingInProgress && calculatedState?.timeLeft && timer === 0) {
      console.log('⏱️ Синхронизирую таймер с рассчитанным временем:', calculatedState.timeLeft);
      setTimer(calculatedState.timeLeft);
    }
  }, [trainingInProgress, calculatedState, timer, setTimer]);

  // Эффект для показа/скрытия плашки
  useEffect(() => {
    if (trainingInProgress && calculatedState) {
      // Показываем плашку при начале тренировки
      setShowProgressInfo(true);
      
      // Скрываем через 5 секунд
      const hideTimer = setTimeout(() => {
        setShowProgressInfo(false);
      }, 5000);
      
      return () => clearTimeout(hideTimer);
    } else {
      // Если тренировка не идёт, скрываем плашку
      setShowProgressInfo(false);
    }
  }, [trainingInProgress, calculatedState]);
  
  // Компонент для отображения информации о текущем прогрессе
  const TrainingProgressInfo = () => {
    // if (!trainingInProgress || !calculatedState) return null;
    if (!trainingInProgress || !calculatedState || !showProgressInfo) return null;

    // // Получаем текущий номер станции (если есть в calculatedState)
    // const currentStationNumber = calculatedState.currentStationIndex 
    //   ? calculatedState.currentStationIndex + 1 
    //   : calculatedState.round;
  
    // Получаем данные из useTrainingState
    const { scheme, currentStationIndex } = useTrainingState();
    
    // Определяем номер станции
    let stationNumber = '?';

    if (scheme && scheme[0] && currentStationIndex !== undefined) {
      // Получаем станцию по индексу
      const station = scheme[0][currentStationIndex];
      if (station) {
        // Берём station_number (например "1A", "2A" и т.д.)
        stationNumber = station.station_number;
      } else {
        // Или просто номер по порядку
        stationNumber = currentStationIndex + 1;
      }
    } else {
      // Если нет данных о станциях, показываем round
      stationNumber = calculatedState.round || '?';
    }
    
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: 9999,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          🎯 Тренировка уже идет
        </div>
        <div style={{ fontSize: '10px', opacity: 0.8 }}>
          {calculatedState.message}
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginTop: '4px',
          fontSize: '10px' 
        }}>
          {/* <span>Станция: {currentStationNumber}</span> */}
          {/* <span>Раунд: {calculatedState.round}</span> */}
          {/* <span>Фаза: {calculatedState.phase}</span> */}
          {/* <span>Осталось: {formatTime(calculatedState.timeLeft)}</span> */}
        
          <span>Станция: {stationNumber}</span>
          <span>Фаза: {calculatedState.phase}</span>
          <span>Осталось: {formatTime(calculatedState.timeLeft)}</span>
        </div>
      </div>
    );
  };
  
  // Функция выбора StartPage (перемещена внутрь компонента)
  const getStartPage = () => {
    console.log('🎯 Выбор StartPage для layout:', currentLayout);
    
    switch(currentLayout) {
      case 'page1': // 3 программы
        return <StartPage3 />;
      case 'page1_3': // 2 программы
        return <StartPage2 />;
      case 'page1_1': // 1 программа, 1-12 клиентов
        return <StartPage />;
      case 'page1_2': // 1 программа, 12-24 клиентов
        return <StartPage1 />;
      default:
        console.warn('⚠️ Неизвестный layout, используем default StartPage');
        return <StartPage />;
    }
  };
  
  // Функция выбора TransitionPage
  const getTransitionPage = () => {
    console.log('🎯 Выбор TransitionPage для layout:', currentLayout);
    
    switch(currentLayout) {
      case 'page1': // 3 программы
        return <TransitionPage3 />;
      case 'page1_3': // 2 программы
        return <TransitionPage2 />;
      case 'page1_1': // 1 программа, 1-12 клиентов
        return <TransitionPage />;
      case 'page1_2': // 1 программа, 12-24 клиентов
        return <TransitionPage1 />;
      default:
        console.warn('⚠️ Неизвестный layout, используем default');
        return <TransitionPage />;
    }
  };
  
  // Рендерим основной компонент плюс информационную панель
  return (
    <>
      <TrainingProgressInfo />
      
      {(() => {
        switch(currentStep) {
          case 1:
            return <WarmupPage />;
          case 2:
            return getStartPage();
          case 3:
            return <ExercisePage />;
          case 4:
            return <RestPage />;
          case 5:
            return getTransitionPage();
          case 6:
            return <FinishPage />;
          default:
            console.warn('⚠️ Неизвестный шаг:', currentStep);
            return <WarmupPage />;
        }
      })()}
    </>
  );
};

export default TrainingFlowRouter;