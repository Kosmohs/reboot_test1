// src/components/SmartLayoutRouter.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadHitZoneLayout } from '../utils/training-data';
import { TrainingStateProvider, TrainingFlowRouter } from '../components/training-flow';

function SmartLayoutRouter() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tvConfig, setTvConfig] = useState(null);
  const [trainingData, setTrainingData] = useState(null);
  
  // ТЕСТОВЫЙ РЕЖИМ
  const TEST_MODE = true; // ← Пока true, потом меняем на false
  const TEST_LAYOUT = 'page1_1'; // ← Для тестирования разных макетов

  // Проверяем, настроен ли телевизор
  const checkTVConfiguration = () => {
    const savedConfig = localStorage.getItem('tvConfig');
    
    if (!savedConfig) {
      console.log('📺 Телевизор не настроен');
      return { configured: false };
    }
    
    try {
      const config = JSON.parse(savedConfig);
      console.log('✅ Телевизор настроен:', config);
      return { configured: true, config };
    } catch (error) {
      console.error('❌ Ошибка парсинга настроек:', error);
      return { configured: false };
    }
  };

  useEffect(() => {
    const loadTrainingData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Проверяем настройки телевизора
        const tvStatus = checkTVConfiguration();
        
        if (!tvStatus.configured) {
          console.log('🔧 Перенаправляем на страницу настройки');
          navigate('/setup');
          return;
        }
        
        const config = tvStatus.config;
        console.log('🎯 Настройки телевизора:', config);
        
        // 2. Загружаем данные тренировки
        let result;
        
        if (TEST_MODE) {
          // ТЕСТОВЫЙ РЕЖИМ
          console.log(`🎯 ТЕСТОВЫЙ РЕЖИМ: ${TEST_LAYOUT}`);
          // Используем тестовые данные (как были в TEST_PROGRAMS)
          result = {
            success: true,
            layout: TEST_LAYOUT,
            programCount: 1,
            clientCount: 8,
            trainingInfo: {
              name: 'Steppe Burn (Тест)',
              time: '16:00',
              trainer: 'Нургалиева Зауре',
              round: 1,
              totalRounds: 16,
              currentApproach: 1,
              warmup_time: 3,
              exercise_time: 3,
              rest_time: 3,
              transition_time: 6
            },
            Scheme: [[]], // ← Пустой массив достаточно для запуска тренировки
            clients: [],
            allPrograms: []
          };
          
        } else {
          // РЕЖИМ РАБОТЫ С API
          console.log('🔗 Загружаем данные тренировки с API', {
            gym_id: config.gym_id,
            televisor_id: config.televisor_id,
            room_id: config.room_id
          });
          
          // Передаем реальные настройки в API
          result = await loadHitZoneLayout({
            gym_id: config.gym_id,
            televisor_id: config.televisor_id,
            room_id: config.room_id
          });
        }
        
        if (!result.success) {
          throw new Error(result.error || 'Ошибка загрузки данных');
        }
        
        console.log('📊 Данные тренировки загружены:', {
          layout: result.layout,
          programCount: result.programCount,
          clientCount: result.clientCount,
          trainingName: result.trainingInfo?.name
        });

        // Сохраняем данные для TrainingStateProvider
        setTrainingData(result);
        setTvConfig(config);

        console.log('🔍 Проверка на тренировочный флоу:', {
            TEST_MODE,
            hasScheme: !!result.Scheme,
            schemeLength: result.Scheme?.length,
            resultKeys: Object.keys(result)
        });

        // Проверяем, нужно ли запускать тренировочный флоу
        // const shouldStartTrainingFlow = result.Scheme && result.Scheme.length > 0;
        const shouldStartTrainingFlow = TEST_MODE || (result.Scheme && result.Scheme.length > 0);
        console.log('shouldStartTrainingFlow:', shouldStartTrainingFlow);
        
        if (!shouldStartTrainingFlow) {
          console.log('📋 Используем старую логику (без тренировочного флоу)');
          let targetPage = result.layout || TEST_LAYOUT;
          
          const validPages = ['page1', 'page1_1', 'page1_2', 'page1_3'];
          if (!validPages.includes(targetPage)) {
            console.warn(`⚠️ Страница ${targetPage} не найдена, используем page1_1`);
            targetPage = 'page1_1';
          }
          
          navigate(`/${targetPage}`, { 
            state: { 
              hitZoneData: result,
              source: TEST_MODE ? 'smart-router-test' : 'smart-router-api',
              testMode: TEST_MODE,
              testLayout: TEST_LAYOUT,
              skipLoading: true
            }
          });
        }

      } catch (err) {
        console.error('❌ Ошибка загрузки данных:', err);
        setError(err.message);
        
        // При ошибке показываем page1_1
        navigate('/page1_1', { 
          state: { 
            error: err.message,
            source: 'smart-router-error',
            testMode: TEST_MODE
          }
        });
        
      } finally {
        setLoading(false);
      }
    };

    // Запускаем с задержкой
    const timeoutId = setTimeout(() => {
      loadTrainingData();
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [navigate]);

  // --- РЕНДЕРИНГ ---

  // Если загрузка
  if (loading) {
    return (
      <div className="smart-router-loading">
        <div className="loading-content">
          <div className="loading-text">Загрузка тренировки...</div>
          <div className="loading-config">
            Телевизор: {tvConfig?.televisor_id || '...'} | 
            Зал: {tvConfig?.room_name || '...'}
          </div>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Если ошибка
  if (error) {
    return (
      <div className="error-page">
        <div>{error}</div>
        <button onClick={() => window.location.reload()}>
          Перезагрузить
        </button>
      </div>
    );
  }

  // Если есть данные для тренировки - рендерим систему тренировок
  if (trainingData && trainingData.Scheme && trainingData.Scheme.length > 0) {
    console.log('🎯 Рендерим систему тренировок');
    
    return (
      <TrainingStateProvider hitZoneData={trainingData}>
        <TrainingFlowRouter />
      </TrainingStateProvider>
    );
  }

  // Если нет данных для тренировки
  return null;
}

export default SmartLayoutRouter;