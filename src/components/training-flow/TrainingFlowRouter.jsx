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

const TrainingFlowRouter = () => {
  const { currentStep, currentLayout } = useTrainingState();
  
  console.log('🔄 TrainingFlowRouter: шаг', currentStep, 'layout:', currentLayout);
  
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
};

export default TrainingFlowRouter;