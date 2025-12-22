// src/components/SmartLayoutRouter.jsx - с тестовым режимом
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadHitZoneLayout } from '../utils/training-data';
import { getTVConfig } from '../config/tv-config';
import { cacheHitZoneData, getCachedHitZoneData } from '../utils/training-data';

// Добавляем импорт нашей системы тренировок
import { TrainingStateProvider, TrainingFlowRouter } from '../components/training-flow';


// ТЕСТОВЫЕ ДАННЫЕ ДЛЯ РАЗНЫХ LAYOUT - ОБНОВЛЕННЫЕ
const TEST_PROGRAMS = {
  'page1': { // 3 программы
    layout: 'page1',
    programCount: 3,
    clientCount: 18,
    trainingInfo: {
      name: 'HIT ZONE (Тест 3 программы)',
      time: '16:00',
      trainer: 'Тренер Тест',
      round: 1,
      totalRounds: 16,
      currentApproach: 1
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
        }))
      },
      { 
        id: '2', 
        name: 'Программа 2 - Strength', 
        clientCount: 5,
        trainer: 'Тренер 2',
        clients: Array.from({ length: 5 }, (_, i) => ({
          ClientID: `test-client-2-${i + 1}`,
          Name: `Клиент 2-${i + 1}`
        }))
      },
      { 
        id: '3', 
        name: 'Программа 3 - Cardio', 
        clientCount: 5,
        trainer: 'Тренер 3',
        clients: Array.from({ length: 5 }, (_, i) => ({
          ClientID: `test-client-3-${i + 1}`,
          Name: `Клиент 3-${i + 1}`
        }))
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
    trainingInfo: {
      name: 'HIT ZONE (Тест 2 программы)',
      time: '16:00',
      trainer: 'Тренер Тест',
      round: 1,
      totalRounds: 16,
      currentApproach: 1
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
        }))
      },
      { 
        id: '2', 
        name: 'Программа B - Upper Zone', 
        clientCount: 4,
        trainer: 'Тренер B',
        clients: Array.from({ length: 4 }, (_, i) => ({
          ClientID: `test-client-B-${i + 1}`,
          Name: `Клиент B-${i + 1}`
        }))
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
    trainingInfo: {
      name: 'Steppe Burn (Тест 1-12 клиентов)',
      time: '16:00',
      trainer: 'Нургалиева Зауре',
      round: 1,
      totalRounds: 16,
      currentApproach: 1
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
        }))
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
    trainingInfo: {
      name: 'Steppe Burn (Тест 12-24 клиентов)',
      time: '16:00',
      trainer: 'Нургалиева Зауре',
      round: 1,
      totalRounds: 16,
      currentApproach: 1
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
        }))
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
  
  // ТЕСТОВЫЙ РЕЖИМ
  const TEST_MODE = false; // ← true = тестовый режим, false = работа с API
  const TEST_LAYOUT = 'page1'; // ← МЕНЯЙ ЗДЕСЬ для теста: 'page1', 'page1_3', 'page1_1', 'page1_2'

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
          // ТЕСТОВЫЙ РЕЖИМ
          console.log(`🎯 ТЕСТОВЫЙ РЕЖИМ: ${TEST_LAYOUT}`);
          result = {
            success: true,
            ...TEST_PROGRAMS[TEST_LAYOUT],
            programs: []
          };
          
          console.log('📊 Тестовые данные:', {
            layout: result.layout,
            programCount: result.programCount,
            clientCount: result.clientCount,
            hasScheme: result.Scheme?.length > 0,
            hasAllPrograms: result.allPrograms?.length > 0,
            allProgramsCount: result.allPrograms?.length
          });
          
        } else {
          // РЕЖИМ РАБОТЫ С API
          console.log('🔗 Режим работы с API');
          result = await loadHitZoneLayout();

          console.log('🎯 SmartLayoutRouter: Результат от loadHitZoneLayout:', {
            success: result.success,
            layout: result.layout,
            programCount: result.programCount,
            clientCount: result.clientCount,
            hasTrainingInfo: !!result.trainingInfo,
            trainingName: result.trainingInfo?.name,
            hasScheme: result.Scheme?.length > 0,
            schemeLength: result.Scheme?.length,
            hasClients: result.clients?.length > 0,
            clientsCount: result.clients?.length,
            hasAllPrograms: result.allPrograms?.length > 0
          });

          // Если есть реальные данные, покажи их
            if (result.Scheme && result.Scheme.length > 0) {
            console.log('🎯 Real Scheme data (first round):', result.Scheme[0]);
            }
            if (result.clients && result.clients.length > 0) {
            console.log('🎯 Real Clients:', result.clients);
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
          hasAllPrograms: result.allPrograms?.length > 0
        });

        // Определяем страницу для перехода
        let targetPage = result.layout || TEST_LAYOUT;
        
        // Проверяем существование страницы
        const validPages = ['page1', 'page1_1', 'page1_2', 'page1_3'];
        if (!validPages.includes(targetPage)) {
          console.warn(`⚠️ Страница ${targetPage} не найдена, используем page1_1`);
          targetPage = 'page1_1';
        }
        
        console.log(`➡️ Перенаправление на /${targetPage} с данными:`, {
          layout: result.layout,
          programCount: result.programCount,
          clientCount: result.clientCount,
          allProgramsCount: result.allPrograms?.length
        });

        console.log('🎯 SmartLayoutRouter: ПЕРЕД navigate');
        console.log('🎯 Данные для передачи:', {
            hasData: !!result,
            hasScheme: result.Scheme?.length > 0,
            hasAllPrograms: result.allPrograms?.length > 0,
            allProgramsCount: result.allPrograms?.length
        });

        console.log('🎯 SmartLayoutRouter: Навигация на', targetPage, 'с данными:', {
            schemeLength: result.Scheme?.length || 0,
            allProgramsCount: result.allPrograms?.length || 0,
            programCount: result.programCount,
            clientCount: result.clientCount,
            timestamp: Date.now()
        });

        // Если это тестовый режим, покажите разницу:
        if (TEST_MODE) {
            console.log('🎯 ТЕСТОВЫЕ ДАННЫЕ:', TEST_PROGRAMS[TEST_LAYOUT].allPrograms);
        } else {
            console.log('🎯 РЕАЛЬНЫЕ ДАННЫЕ (first program):', result.allPrograms?.[0]);
        }
        
        // Передаем данные на целевую страницу
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


  // ВАЖНО: если loading закончился, возвращаем null
  if (!loading) {
    return null;
  } else {
//   // Пока загрузка
//   if (loading) {
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

  return null;
}

export default SmartLayoutRouter;