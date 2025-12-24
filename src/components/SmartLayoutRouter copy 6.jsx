// src/components/SmartLayoutRouter.jsx - ОБНОВЛЁННАЯ ВЕРСИЯ
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadHitZoneLayout } from '../utils/training-data';
import { getTVConfig } from '../config/tv-config';
import { TrainingStateProvider, TrainingFlowRouter } from '../components/training-flow';

import NextTrainingDisplay from './NextTrainingDisplay'; 
import NoTrainingsDisplay from './NoTrainingsDisplay'; 
import CurrentTrainingNoScheme from './CurrentTrainingNoScheme';

// ТЕСТОВЫЕ ДАННЫЕ ДЛЯ РАЗНЫХ LAYOUT
const TEST_PROGRAMS = {
  'page1': { // 3 программы
    layout: 'page1',
    programCount: 3,
    clientCount: 18,
    status: 'current', // или 'next', 'no_trainings' для теста разных сценариев
    trainingInfo: {
      name: 'HIT ZONE (Тест 3 программы)',
    //   time: '16:00',
      time: new Date(Date.now()).toISOString(), // Сейчас
      endTime: new Date(Date.now() + 55 * 60000).toISOString(), // Через 55 минут
      trainer: 'Тренер Тест',
      round: 1,
      totalRounds: 16,
      currentApproach: 1,
      warmup_time: 2,
      exercise_time: 2,
      rest_time: 2,
      transition_time: 2
    },
    clients: Array.from({ length: 8 }, (_, i) => ({
      ClientID: `test-client-${i + 1}`,
      Name: `Тестовый клиент ${i + 1}`
    })),
    Scheme: [[
      { round: 1, client_id: 'test-1', client_name: 'Клиент 1', station_number: '1A' },
      { round: 1, client_id: 'test-2', client_name: 'Клиент 2', station_number: '2A' },
      { round: 1, client_id: 'test-3', client_name: 'Клиент 3', station_number: '3A' },
      { round: 1, client_id: 'test-4', client_name: 'Клиент 4', station_number: '4A' },
      { round: 1, client_id: 'test-5', client_name: 'Клиент 5', station_number: '5A' },
      { round: 1, client_id: 'test-6', client_name: 'Клиент 6', station_number: '6A' },
      { round: 1, client_id: 'test-7', client_name: 'Клиент 7', station_number: '7A' },
      { round: 1, client_id: 'test-8', client_name: 'Клиент 8', station_number: '8A' }
    ]],
    allPrograms: [ // ← ВАЖНО: данные для 3 программ
      { 
        id: '1', 
        name: 'Программа 1 - HIIT', 
        clientCount: 8,
        trainer: 'Тренер 1',
        clients: Array.from({ length: 8 }, (_, i) => ({
          ClientID: `test-client-1-${i + 1}`,
          Name: `Клиент 1-${i + 1}`
        })),
        training: {
          warmup_time: 2,
          exercise_time: 2,
          rest_time: 2,
          transition_time: 2
        }
      },
      { 
        id: '2', 
        name: 'Программа 2 - Strength', 
        clientCount: 5,
        trainer: 'Тренер 2',
        clients: Array.from({ length: 5 }, (_, i) => ({
          ClientID: `test-client-2-${i + 1}`,
          Name: `Клиент 2-${i + 1}`
        })),
        training: {
          warmup_time: 2,
          exercise_time: 2,
          rest_time: 2,
          transition_time: 2
        }
      },
      { 
        id: '3', 
        name: 'Программа 3 - Cardio', 
        clientCount: 5,
        trainer: 'Тренер 3',
        clients: Array.from({ length: 5 }, (_, i) => ({
          ClientID: `test-client-3-${i + 1}`,
          Name: `Клиент 3-${i + 1}`
        })),
        training: {
          warmup_time: 3,
          exercise_time: 3,
          rest_time: 3,
          transition_time: 5
        }
      }
    ],
    programData: {
      title: 'HIT ZONE (Тест 3 программы)',
      description: 'Три параллельные программы',
      color: '#FF0000'
    }
  },
  'page1_3': { // 2 программы
    layout: 'page1_3',
    programCount: 2,
    clientCount: 16,
    status: 'next', // Тестируем следующий статус
    trainingInfo: {
      name: 'HIT ZONE (Тест 2 программы)',
    //   time: '16:00',
      time: new Date(Date.now() + 3600000).toISOString(), // Через 1 час
      endTime: new Date(Date.now() + 3600000 + 55 * 60000).toISOString(), // Через 1:55
      trainer: 'Тренер Тест',
      round: 1,
      totalRounds: 16,
      currentApproach: 1,
      warmup_time: 3,
      exercise_time: 3,
      rest_time: 3,
      transition_time: 6
    },
    clients: Array.from({ length: 12 }, (_, i) => ({
      ClientID: `test-client-${i + 1}`,
      Name: `Тестовый клиент ${i + 1}`
    })),
    Scheme: [[
      { round: 1, client_id: 'test-1', client_name: 'Клиент 1', station_number: '1A' },
      { round: 1, client_id: 'test-2', client_name: 'Клиент 2', station_number: '2A' },
      { round: 1, client_id: 'test-3', client_name: 'Клиент 3', station_number: '3A' },
      { round: 1, client_id: 'test-4', client_name: 'Клиент 4', station_number: '4A' },
      { round: 1, client_id: 'test-5', client_name: 'Клиент 5', station_number: '5A' },
      { round: 1, client_id: 'test-6', client_name: 'Клиент 6', station_number: '6A' }
    ]],
    allPrograms: [ // ← ВАЖНО: данные для 2 программ
      { 
        id: '1', 
        name: 'Программа A - Full Body', 
        clientCount: 12,
        trainer: 'Тренер А',
        clients: Array.from({ length: 12 }, (_, i) => ({
          ClientID: `test-client-A-${i + 1}`,
          Name: `Клиент А-${i + 1}`
        })),
        training: {
          warmup_time: 3,
          exercise_time: 3,
          rest_time: 3,
          transition_time: 5
        }
      },
      { 
        id: '2', 
        name: 'Программа B - Upper Zone', 
        clientCount: 4,
        trainer: 'Тренер B',
        clients: Array.from({ length: 4 }, (_, i) => ({
          ClientID: `test-client-B-${i + 1}`,
          Name: `Клиент B-${i + 1}`
        })),
        training: {
          warmup_time: 3,
          exercise_time: 3,
          rest_time: 3,
          transition_time: 6
        }
      }
    ],
    programData: {
      title: 'HIT ZONE (Тест 2 программы)',
      description: 'Две параллельные программы',
      color: '#00FF00'
    }
  },
  'page1_1': { // 1 программа, мало клиентов
    layout: 'page1_1',
    programCount: 1,
    clientCount: 8,
    status: 'no_trainings', // Тестируем отсутствие тренировок
    trainingInfo: {
      name: 'Steppe Burn (Тест 1-12 клиентов)',
    //   time: '16:00',
      time: new Date(Date.now() - 7200000).toISOString(), // 2 часа назад
      endTime: new Date(Date.now() - 7200000 + 55 * 60000).toISOString(), // 1:05 назад
      trainer: 'Нургалиева Зауре',
      round: 1,
      totalRounds: 16,
      currentApproach: 1,
      warmup_time: 3,
      exercise_time: 3,
      rest_time: 3,
      transition_time: 6
    },
    clients: Array.from({ length: 8 }, (_, i) => ({
      ClientID: `test-client-${i + 1}`,
      Name: `Тестовый клиент ${i + 1}`
    })),
    Scheme: [[
      { round: 1, client_id: 'test-1', client_name: 'Клиент 1', station_number: '1A' },
      { round: 1, client_id: 'test-2', client_name: 'Клиент 2', station_number: '2A' },
      { round: 1, client_id: 'test-3', client_name: 'Клиент 3', station_number: '3A' },
      { round: 1, client_id: 'test-4', client_name: 'Клиент 4', station_number: '4A' },
      { round: 1, client_id: 'test-5', client_name: 'Клиент 5', station_number: '5A' },
      { round: 1, client_id: 'test-6', client_name: 'Клиент 6', station_number: '6A' },
      { round: 1, client_id: 'test-7', client_name: 'Клиент 7', station_number: '7A' },
      { round: 1, client_id: 'test-8', client_name: 'Клиент 8', station_number: '8A' }
    ]],
    allPrograms: [ // ← ВАЖНО: данные для 1 программы
      { 
        id: '1', 
        name: 'Steppe Burn (Тест)', 
        clientCount: 8,
        trainer: 'Нургалиева Зауре',
        clients: Array.from({ length: 8 }, (_, i) => ({
          ClientID: `test-client-${i + 1}`,
          Name: `Клиент ${i + 1}`
        })),
        training: {
          warmup_time: 2,
          exercise_time: 2,
          rest_time: 2,
          transition_time: 2
        }
      }
    ],
    programData: {
      title: 'Steppe Burn (Тест)',
      description: 'Высокоинтенсивная тренировка',
      color: '#0000FF'
    }
  },
  'page1_2': { // 1 программа, много клиентов
    layout: 'page1_2',
    programCount: 1,
    clientCount: 15,
    status: 'available', // Тестируем "доступно, но не по времени"
    trainingInfo: {
      name: 'Steppe Burn (Тест 12-24 клиентов)',
    //   time: '16:00',
      time: new Date(Date.now() + 7200000).toISOString(), // Через 2 часа
      endTime: new Date(Date.now() + 7200000 + 55 * 60000).toISOString(), // Через 2:55
      trainer: 'Нургалиева Зауре',
      round: 1,
      totalRounds: 16,
      currentApproach: 1,
      warmup_time: 3,
      exercise_time: 3,
      rest_time: 3,
      transition_time: 5
    },
    clients: Array.from({ length: 15 }, (_, i) => ({
      ClientID: `test-client-${i + 1}`,
      Name: `Тестовый клиент ${i + 1}`
    })),
    Scheme: [[
      { round: 1, client_id: 'test-1', client_name: 'Клиент 1', station_number: '1A' },
      { round: 1, client_id: 'test-2', client_name: 'Клиент 2', station_number: '2A' },
      { round: 1, client_id: 'test-3', client_name: 'Клиент 3', station_number: '3A' },
      { round: 1, client_id: 'test-4', client_name: 'Клиент 4', station_number: '4A' },
      { round: 1, client_id: 'test-5', client_name: 'Клиент 5', station_number: '5A' },
      { round: 1, client_id: 'test-6', client_name: 'Клиент 6', station_number: '6A' },
      { round: 1, client_id: 'test-7', client_name: 'Клиент 7', station_number: '7A' },
      { round: 1, client_id: 'test-8', client_name: 'Клиент 8', station_number: '8A' },
      { round: 1, client_id: 'test-9', client_name: 'Клиент 9', station_number: '1B' },
      { round: 1, client_id: 'test-10', client_name: 'Клиент 10', station_number: '2B' },
      { round: 1, client_id: 'test-11', client_name: 'Клиент 11', station_number: '3B' },
      { round: 1, client_id: 'test-12', client_name: 'Клиент 12', station_number: '4B' },
      { round: 1, client_id: 'test-13', client_name: 'Клиент 13', station_number: '5B' },
      { round: 1, client_id: 'test-14', client_name: 'Клиент 14', station_number: '6B' },
      { round: 1, client_id: 'test-15', client_name: 'Клиент 15', station_number: '7B' }
    ]],
    allPrograms: [ // ← ВАЖНО: данные для 1 программы
      { 
        id: '1', 
        name: 'Steppe Burn Large (Тест)', 
        clientCount: 15,
        trainer: 'Нургалиева Зауре',
        clients: Array.from({ length: 15 }, (_, i) => ({
          ClientID: `test-client-${i + 1}`,
          Name: `Клиент ${i + 1}`
        })),
        training: {
          warmup_time: 3,
          exercise_time: 3,
          rest_time: 3,
          transition_time: 6
        }
      }
    ],
    programData: {
      title: 'Steppe Burn Large (Тест)',
      description: 'Большая группа, высокая интенсивность',
      color: '#FF00FF'
    }
  }
};

function SmartLayoutRouter() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tvConfig, setTvConfig] = useState(null);
  const [trainingData, setTrainingData] = useState(null);
  
  // ТЕСТОВЫЙ РЕЖИМ
  const TEST_STATUS = 'no_trainings'; // Меняй тут для теста: 'current', 'next', 'no_trainings', 'available'
  
  const TEST_MODE = false; // ← true = тестовый режим, false = работа с API
  const TEST_LAYOUT = 'page1_1'; // ← МЕНЯЙ ЗДЕСЬ для теста

    // '3-programs'       -> Page1                  current
    // '2-programs'       -> Page1_3                next
    // '1-program-small'  -> Page1_1 (до 12 клиентов) no_trainings
    // '1-program-large'  -> Page1_2 (13-24 клиентов) available


  // Получаем конфигурацию телевизора
  useEffect(() => {
    const config = getTVConfig();
    setTvConfig(config);
    console.log('SmartRouter HIT ZONE:', {
      config: config,
      testMode: TEST_MODE,
      testLayout: TEST_LAYOUT
    });
  }, []);

  useEffect(() => {
    const determineAndNavigate = async () => {
      if (!tvConfig) return;

      setLoading(true);
      setError(null);

      try {
        let result;
        
        if (TEST_MODE) {
            // ТЕСТОВЫЙ РЕЖИМ - используем готовые полные данные
            // console.log(`🎯 ТЕСТОВЫЙ РЕЖИМ: ${TEST_LAYOUT}`);
            console.log(`🎯 ТЕСТОВЫЙ РЕЖИМ: ${TEST_LAYOUT}, статус: ${TEST_STATUS}`);
            
            result = {
                success: true,
                ...TEST_PROGRAMS[TEST_LAYOUT], // ← ВСЕ данные!
                status: TEST_STATUS, // Переопределяем статус из тестового переключателя
                programs: [],
                source: 'test-mode'
            };
            
            console.log('✅ Полные тестовые данные загружены из TEST_PROGRAMS');
            console.log('📊 Тестовые данные:', {
                layout: result.layout,
                programCount: result.programCount,
                clientCount: result.clientCount,
                hasScheme: result.Scheme?.length > 0,
                hasAllPrograms: result.allPrograms?.length > 0,
                allProgramsCount: result.allPrograms?.length
            });
        } else {
            // РЕАЛЬНЫЙ РЕЖИМ - запрашиваем данные с API
            console.log('🔄 РЕАЛЬНЫЙ РЕЖИМ: запрос данных с API');
            console.log('📡 Конфигурация телевизора:', tvConfig);
            
            try {
                // Передаем реальные настройки в API
                result = await loadHitZoneLayout({
                    // gym_id: tvConfig.gym_id,
                    // televisor_id: tvConfig.televisor_id,
                    // room_id: tvConfig.room_id
                    useCacheAsFallback: true
                });
                
                console.log('✅ Реальные данные получены:', {
                    success: result?.success,
                    layout: result?.layout,
                    programCount: result?.programCount,
                    clientCount: result?.clientCount,
                    hasScheme: result?.Scheme?.length > 0,
                    hasAllPrograms: result?.allPrograms?.length > 0
                });

                console.log('🔍 ДАННЫЕ ПЕРЕДАВАЕМЫЕ В TrainingStateProvider:', {
                    layout: result.layout,
                    source: result.source || 'unknown',
                    schemeFirstRound: result.Scheme?.[0],
                    schemeClients: result.Scheme?.[0]?.map(c => c.client_name),
                    trainingInfo: result.trainingInfo,
                    programCount: result.programCount
                });
                
                if (!result || !result.success) {
                    console.warn('⚠️ Реальные данные не получены, используем тестовые');
                    result = {
                        success: true,
                        ...TEST_PROGRAMS['page1_1'], // fallback на тестовые
                        programs: []
                    };
                }
                
            } catch (apiError) {
                console.error('❌ Ошибка при загрузке реальных данных:', apiError);
                // В случае ошибки - показываем тестовые данные
                console.log('⚠️ Показываем тестовые данные из-за ошибки API');
                result = {
                    success: true,
                    ...TEST_PROGRAMS['page1_1'], // fallback
                    programs: []
                };
            }
        }
        
        if (!result.success) {
          throw new Error(result.error || 'Ошибка загрузки данных');
        }
        
        console.log('SmartRouter: Результат:', {
          layout: result.layout,
          programCount: result.programCount,
          clientCount: result.clientCount,
          trainingName: result.trainingInfo?.name,
          hasAllPrograms: result.allPrograms?.length > 0,
          source: TEST_MODE ? 'test' : 'api'
        });

        // Сохраняем данные для TrainingStateProvider
        setTrainingData(result);

        // // Проверяем, нужно ли запускать тренировочный флоу
        // // Если в данных есть Scheme и это HIT ZONE тренировка - запускаем флоу
        // const shouldStartTrainingFlow = result.Scheme && result.Scheme.length > 0;
        
        // if (shouldStartTrainingFlow) {
        //   console.log('🚀 Запускаем тренировочный флоу');
        //   // НЕ делаем navigate, остаёмся на этой странице
        //   // TrainingStateProvider + TrainingFlowRouter будут рендериться ниже
        // } else {
        //   // Если нет данных для тренировки - используем старую логику
        //   console.log('📋 Используем старую логику (без тренировочного флоу)');
        //   let targetPage = result.layout || TEST_LAYOUT;
          
        //   const validPages = ['page1', 'page1_1', 'page1_2', 'page1_3'];
        //   if (!validPages.includes(targetPage)) {
        //     console.warn(`⚠️ Страница ${targetPage} не найдена, используем page1_1`);
        //     targetPage = 'page1_1';
        //   }
          
        //   navigate(`/${targetPage}`, { 
        //     state: { 
        //       hitZoneData: result,
        //       source: TEST_MODE ? 'smart-router-test' : 'smart-router-api',
        //       testMode: TEST_MODE,
        //       testLayout: TEST_LAYOUT,
        //       skipLoading: true,
        //       tvConfig: tvConfig
        //     }
        //   });
        // }

        // Проверяем, нужно ли запускать тренировочный флоу
        // ЕСЛИ В ДАННЫХ ЕСТЬ СТАТУС next/current/available - НЕ ДЕЛАЕМ РЕДИРЕКТ!
        const shouldStartTrainingFlow = 
            (result.Scheme && result.Scheme.length > 0) || 
            result.status === 'current' || 
            result.status === 'next' || 
            result.status === 'available';

            if (shouldStartTrainingFlow) {
            console.log('🚀 Запускаем систему тренировок (статус:', result.status, ')');
            // Сохраняем данные - они отобразятся в рендеринге ниже
            setTrainingData(result);
            // НЕ делаем navigate!
            } else {
            // Если нет данных для тренировки - используем старую логику
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
                skipLoading: true,
                tvConfig: tvConfig
                }
            });
        }

      } catch (err) {
        console.error('❌ SmartRouter Ошибка:', err);
        setError(err.message);
        
        // При ошибке показываем page1_1 как дефолт
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
      determineAndNavigate();
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [tvConfig, navigate]);

  // --- РЕНДЕРИНГ ---

  // Если загрузка
  if (loading) {
    return (
      <div className="smart-router-loading">
        <div className="loading-content">
          <div className="loading-text">Определение макета HIT ZONE...</div>
          <div className="loading-details">
            {TEST_MODE ? `Тестовый режим: ${TEST_LAYOUT}` : 'Режим работы с API'}
          </div>
          <div className="loading-config">
            Телевизор: {tvConfig?.televisor_id || '...'} | Зал: HIT ZONE
          </div>
          <div className="loading-spinner"></div>
        </div>
        
        <style>{`
          .smart-router-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-family: Arial, sans-serif;
          }
          .loading-content {
            text-align: center;
            max-width: 500px;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
          }
          .loading-text {
            font-size: 24px;
            margin-bottom: 20px;
            font-weight: bold;
          }
          .loading-details {
            font-size: 16px;
            margin-bottom: 10px;
            opacity: 0.9;
          }
          .loading-config {
            font-size: 14px;
            margin-bottom: 30px;
            opacity: 0.7;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            margin: 0 auto;
            animation: spin 1s ease-in-out infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Если ошибка
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '20px',
        color: 'red',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div>{error}</div>
        <button 
          onClick={() => window.location.reload()}
          style={{ padding: '10px 20px', marginTop: '20px' }}
        >
          Перезагрузить
        </button>
      </div>
    );
  }

//   // Если есть данные для тренировки - рендерим систему тренировок
//   if (trainingData && trainingData.Scheme && trainingData.Scheme.length > 0) {
//     console.log('🎯 Рендерим систему тренировок с данными:', {
//       name: trainingData.trainingInfo?.name,
//       schemeLength: trainingData.Scheme.length
//     });
    
//     return (
//       <TrainingStateProvider hitZoneData={trainingData}>
//         <TrainingFlowRouter />
//       </TrainingStateProvider>
//     );
//   }



//   if (trainingData) {

//     // ОБЕСПЕЧИВАЕМ, ЧТО status ВСЕГДА ЕСТЬ
//     const status = trainingData.status || 'available';
//     console.log('🎯 Статус тренировки:', status);

//     console.log('🎯 Получены данные тренировки:', {
//         status: trainingData.status,
//         layout: trainingData.layout,
//         hasScheme: trainingData.Scheme?.length > 0
//     });

//     // В зависимости от статуса рендерим разные компоненты
//     switch (trainingData.status) {
//         case 'current':
//         // Текущая тренировка - запускаем тренировочный флоу
//         if (trainingData.Scheme && trainingData.Scheme.length > 0) {
//             console.log('🚀 Запускаем тренировочный флоу (текущая тренировка)');
//             return (
//             <TrainingStateProvider hitZoneData={trainingData}>
//                 <TrainingFlowRouter />
//             </TrainingStateProvider>
//             );
//         } else {
//             console.log('⚠️ Текущая тренировка без Scheme, показываем следующую');
//             return <NextTrainingDisplay trainingData={trainingData} />;
//         }
        
//         case 'next':
//         // Следующая тренировка - показываем обратный отсчёт
//         console.log('⏭️ Показываем следующую тренировку с обратным отсчётом');
//         return <NextTrainingDisplay trainingData={trainingData} />;
        
//         case 'no_trainings':
//         // Нет тренировок
//         console.log('📭 Нет тренировок на сегодня');
//         return <NoTrainingsDisplay />;
        
//         case 'available':
//         // Есть тренировка, но не по времени (запасной вариант)
//         if (trainingData.Scheme && trainingData.Scheme.length > 0) {
//             console.log('📋 Показываем доступную тренировку (не по времени)');
//             return (
//             <TrainingStateProvider hitZoneData={trainingData}>
//                 <TrainingFlowRouter />
//             </TrainingStateProvider>
//             );
//         } else {
//             return <NoTrainingsDisplay />;
//         }
        
//         default:
//         console.warn(`Неизвестный статус: ${trainingData.status}`);
//         return <NoTrainingsDisplay />;
//     }
//   }



  // Вместо switch, сделаем более надёжную проверку:
    if (trainingData) {
        console.log('🎯 Получены данные тренировки:', {
            status: trainingData.status,
            layout: trainingData.layout,
            hasScheme: trainingData.Scheme?.length > 0,
            source: trainingData.source
    });

    // Определяем статус с fallback
    const status = trainingData.status || 
                    (trainingData.Scheme?.length > 0 ? 'available' : 'no_trainings');
    
    console.log(`🎯 Статус для отображения: ${status}`);
    
    // // Рендерим в зависимости от статуса
    // if (status === 'current' && trainingData.Scheme?.length > 0) {
    //     console.log('🚀 Запускаем тренировочный флоу (текущая тренировка)');
    //     return (
    //     <TrainingStateProvider hitZoneData={trainingData}>
    //         <TrainingFlowRouter />
    //     </TrainingStateProvider>
    //     );
    // }
    
    // if (status === 'next' || status === 'available') {
    //     console.log('⏭️ Показываем следующую/доступную тренировку');
    //     return <NextTrainingDisplay trainingData={trainingData} />;
    // }
    
    // if (status === 'no_trainings') {
    //     console.log('📭 Нет тренировок на сегодня');
    //     return <NoTrainingsDisplay />;
    // }


    // Рендерим в зависимости от статуса
    switch (status) {
        case 'current':
            // Текущая тренировка
            if (trainingData.Scheme?.length > 0) {
            console.log('🚀 Текущая тренировка со Scheme - запускаем флоу');
            return (
                <TrainingStateProvider hitZoneData={trainingData}>
                    <TrainingFlowRouter />
                </TrainingStateProvider>
            );
            } else {
                console.log('⏰ Текущая тренировка без Scheme - показываем как активную');
                // return <NextTrainingDisplay trainingData={trainingData} />;
                return <CurrentTrainingNoScheme trainingData={trainingData} />;
            }
            
        case 'next':
        case 'available':
            // Следующая или доступная тренировка
            console.log(`⏭️ ${status === 'next' ? 'Следующая' : 'Доступная'} тренировка`);
            return <NextTrainingDisplay trainingData={trainingData} />;
            
        case 'no_trainings':
            // Нет тренировок
            console.log('📭 Нет тренировок на сегодня');
            return <NoTrainingsDisplay />;
            
        default:
            console.warn(`⚠️ Неизвестный статус: ${status}, показываем NoTrainings`);
            return <NoTrainingsDisplay />;
    }
    
    // Fallback на случай ошибки
    console.warn(`⚠️ Неизвестный статус: ${status}, показываем NoTrainings`);
    return <NoTrainingsDisplay />;
    }

  // Если нет данных для тренировки, но данные загружены успешно
  // (например, для страниц без Scheme)
  if (trainingData) {
    console.log('📋 Нет данных для тренировки, но данные загружены');
    return null; // navigate уже произошёл в determineAndNavigate
  }

  // Дефолтный рендер
  return null;
}

export default SmartLayoutRouter;