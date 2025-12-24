// src/components/NoTrainingsDisplay.jsx
import { useState, useEffect, useCallback } from 'react';
import { loadHitZoneLayout } from '../utils/training-data';

function NoTrainingsDisplay() {
  const [lastCheck, setLastCheck] = useState(new Date());
  const [isChecking, setIsChecking] = useState(false);
  const [checkCountdown, setCheckCountdown] = useState(300); // 5 минут в секундах

  // Проверка расписания
  const checkSchedule = useCallback(async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    console.log('🔍 Проверяю расписание...');
    
    try {
      const newData = await loadHitZoneLayout({ useCacheAsFallback: true });
      setLastCheck(new Date());
      
      // Если появились тренировки - вернём null и родитель переключится
      if (newData.status !== 'no_trainings') {
        console.log('✅ Найдены тренировки! Статус:', newData.status);
        return newData;
      }
      
      console.log('📭 Тренировок всё еще нет');
    } catch (error) {
      console.error('❌ Ошибка при проверке:', error);
    } finally {
      setIsChecking(false);
    }
    
    return null;
  }, [isChecking]);

  // Таймер обратного отсчёта
  useEffect(() => {
    if (checkCountdown <= 0) {
      checkSchedule();
      setCheckCountdown(300); // Сбрасываем на 5 минут
      return;
    }

    const timer = setInterval(() => {
      setCheckCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [checkCountdown, checkSchedule]);

  // Планирование проверки на завтра (6:00 утра)
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(6, 0, 0, 0); // 6:00 утра
    
    const timeUntilTomorrow = tomorrow - now;
    
    console.log(`⏰ Следующая проверка завтра в 6:00 (через ${Math.round(timeUntilTomorrow / 3600000)} часов)`);
    
    const tomorrowTimer = setTimeout(() => {
      console.log('🌅 Наступило утро, проверяем расписание...');
      checkSchedule();
    }, timeUntilTomorrow);

    return () => clearTimeout(tomorrowTimer);
  }, [checkSchedule]);

  // Форматирование времени
  const formatTime = (date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const minutesLeft = Math.floor(checkCountdown / 60);
  const secondsLeft = checkCountdown % 60;

  return (
    <div className="no-trainings-container">
      <div className="no-trainings-content">
        {/* Основное сообщение */}
        <div className="message-section">
          <div className="icon">📭</div>
          <h1>Нет тренировок на сегодня</h1>
          <p className="subtitle">
            Расписание на сегодня завершено или тренировки не запланированы
          </p>
        </div>

        {/* Время и детали */}
        <div className="info-section">
          <div className="info-card">
            <div className="info-label">Последняя проверка</div>
            <div className="info-value">{formatTime(lastCheck)}</div>
          </div>
          
          <div className="info-card">
            <div className="info-label">Следующая проверка через</div>
            <div className="countdown-value">
              {minutesLeft.toString().padStart(2, '0')}:
              {secondsLeft.toString().padStart(2, '0')}
            </div>
          </div>

          <div className="info-card">
            <div className="info-label">Следующая авто-проверка</div>
            <div className="info-value">Завтра в 6:00</div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="actions-section">
          <button 
            className="check-button" 
            onClick={checkSchedule}
            disabled={isChecking}
          >
            {isChecking ? (
              <>
                <span className="spinner"></span>
                Проверка...
              </>
            ) : (
              'Проверить сейчас'
            )}
          </button>
          
          <div className="hint">
            Расписание обновляется администратором. 
            При появлении новых тренировок они отобразятся автоматически.
          </div>
        </div>

        {/* Отладочная информация */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-section">
            <h3>Отладка</h3>
            <div className="debug-actions">
              <button onClick={() => console.log('Текущее время:', new Date().toLocaleString())}>
                Показать время
              </button>
              <button onClick={() => {
                localStorage.removeItem('hit_zone_data_cache');
                console.log('Кэш очищен');
              }}>
                Очистить кэш
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .no-trainings-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #2c3e50 0%, #4a6491 100%);
    color: white;
    font-family: 'Arial', sans-serif;
    padding: 20px;
  }

  .no-trainings-content {
    max-width: 800px;
    width: 100%;
    text-align: center;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 40px;
    backdrop-filter: blur(10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }

  .message-section {
    margin-bottom: 40px;
  }

  .icon {
    font-size: 80px;
    margin-bottom: 20px;
    opacity: 0.7;
  }

  h1 {
    font-size: 36px;
    margin: 0 0 15px 0;
    color: #ecf0f1;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .subtitle {
    font-size: 18px;
    color: #bdc3c7;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .info-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin: 40px 0;
  }

  .info-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.3s;
  }

  .info-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }

  .info-label {
    font-size: 14px;
    color: #95a5a6;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .info-value {
    font-size: 20px;
    font-weight: bold;
    color: #3498db;
  }

  .countdown-value {
    font-size: 24px;
    font-weight: bold;
    color: #2ecc71;
    font-family: 'Courier New', monospace;
    letter-spacing: 2px;
  }

  .actions-section {
    margin-top: 40px;
    padding-top: 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .check-button {
    background: linear-gradient(45deg, #3498db, #2980b9);
    color: white;
    border: none;
    padding: 18px 36px;
    font-size: 18px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-width: 200px;
    font-weight: bold;
    letter-spacing: 1px;
  }

  .check-button:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(52, 152, 219, 0.4);
    background: linear-gradient(45deg, #2980b9, #3498db);
  }

  .check-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .hint {
    font-size: 14px;
    color: #7f8c8d;
    margin-top: 20px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.5;
  }

  .debug-section {
    margin-top: 30px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    text-align: left;
  }

  .debug-section h3 {
    margin-top: 0;
    color: #95a5a6;
    font-size: 16px;
  }

  .debug-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .debug-actions button {
    background: #34495e;
    color: #ecf0f1;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    transition: background 0.2s;
  }

  .debug-actions button:hover {
    background: #2c3e50;
  }

  @media (max-width: 768px) {
    .no-trainings-content {
      padding: 20px;
    }
    
    h1 {
      font-size: 28px;
    }
    
    .info-section {
      grid-template-columns: 1fr;
    }
    
    .check-button {
      width: 100%;
    }
  }
`;

export default NoTrainingsDisplay;