// src/components/training-flow/TrainingFlowRouter.jsx
import { useTrainingState } from './useTrainingState';
import WarmupPage from './WarmupPage';
import StartPage from './StartPage';
import ExercisePage from './ExercisePage';
import RestPage from './RestPage';
import TransitionPage from './TransitionPage';
import FinishPage from './FinishPage';

const TrainingFlowRouter = () => {
  const { currentStep } = useTrainingState();
  
  console.log('🔄 TrainingFlowRouter: текущий шаг', currentStep);
  
  switch(currentStep) {
    case 1:
      return <WarmupPage />;
    case 2:
      return <StartPage />;
    case 3:
      return <ExercisePage />;
    case 4:
      return <RestPage />;
    case 5:
      return <TransitionPage />;
    case 6:
      return <FinishPage />;
    default:
      console.warn('⚠️ Неизвестный шаг тренировки:', currentStep);
      return <WarmupPage />;
  }
};

export default TrainingFlowRouter;