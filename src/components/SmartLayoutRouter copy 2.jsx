// src/components/SmartLayoutRouter.jsx - с тестовым режимом
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadHitZoneLayout } from '../utils/training-data';
import { getTVConfig } from '../config/tv-config';

// ТЕСТОВЫЕ ДАННЫЕ ДЛЯ РАЗНЫХ LAYOUT
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
      totalRounds: 16
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
      totalRounds: 16
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
      totalRounds: 16
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
      totalRounds: 16
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
  const TEST_LAYOUT = 'page1'; // ← меняй здесь: 'page1', 'page1_3', 'page1_1', 'page1_2'

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
            programs: [],
            clients: []
          };
          
          // Добавляем тестовых клиентов
          if (TEST_LAYOUT === 'page1_1' || TEST_LAYOUT === 'page1_2') {
            result.clients = Array.from({ length: result.clientCount }, (_, i) => ({
              ClientID: `test-client-${i + 1}`,
              Name: `Тестовый клиент ${i + 1}`
            }));
          }
        } else {
          // РЕЖИМ РАБОТЫ С API
          console.log('🔗 Режим работы с API');
          result = await loadHitZoneLayout();

          // Логируем что получили
            console.log('📊 Результат от API:', {
                success: result.success,
                layout: result.layout,
                clientCount: result.clientCount,
                hasScheme: !!result.Scheme,
                schemeLength: result.Scheme?.length,
                hasClients: !!result.clients,
                clientsLength: result.clients?.length,
                trainingInfo: result.trainingInfo
            });
        }
        
        if (!result.success) {
          throw new Error(result.error || 'Ошибка загрузки данных');
        }
        
        console.log('SmartRouter: Результат:', {
          layout: result.layout,
          programCount: result.programCount,
          clientCount: result.clientCount,
          trainingName: result.trainingInfo?.name
        });

        // Определяем страницу для перехода
        let targetPage = result.layout || TEST_LAYOUT;
        
        // Проверяем существование страницы
        const validPages = ['page1', 'page1_1', 'page1_2', 'page1_3'];
        if (!validPages.includes(targetPage)) {
          console.warn(`⚠️ Страница ${targetPage} не найдена, используем page1_1`);
          targetPage = 'page1_1';
        }
        
        console.log(`➡️ Перенаправление на /${targetPage}`);
        
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

  // Пока загрузка
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