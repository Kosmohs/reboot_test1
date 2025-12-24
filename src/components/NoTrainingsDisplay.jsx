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
    align-items: flex-start; /* Изменено для скролла */
    min-height: 100vh; /* Изменено на min-height */
    background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%);
    color: #ffffff;
    font-family: 'Segoe UI', 'Arial', sans-serif;
    padding: 40px 20px; /* Увеличены отступы */
    overflow-y: auto; /* Добавлен скролл */
  }

  .no-trainings-content {
    max-width: 800px;
    width: 100%;
    text-align: center;
    background: rgba(20, 20, 20, 0.85);
    border-radius: 20px;
    padding: 50px 40px;
    backdrop-filter: blur(10px);
    box-shadow: 
      0 15px 35px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 102, 0, 0.15);
    border: 1px solid rgba(255, 102, 0, 0.2);
    margin: 20px 0; /* Отступы для скролла */
    position: relative;
    overflow: hidden;
  }

  .no-trainings-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ff6600 0%, #ff8c00 50%, #ff6600 100%);
    z-index: 1;
  }

  .message-section {
    margin-bottom: 50px;
    position: relative;
  }

  .icon {
    font-size: 80px;
    margin-bottom: 25px;
    opacity: 0.9;
    color: #ff6600;
    text-shadow: 0 0 30px rgba(255, 102, 0, 0.5);
    filter: drop-shadow(0 0 10px rgba(255, 102, 0, 0.3));
  }

  h1 {
    font-size: 42px;
    margin: 0 0 20px 0;
    background: linear-gradient(45deg, #ffffff, #ffcc99);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 15px rgba(255, 102, 0, 0.2);
    font-weight: 700;
    line-height: 1.2;
  }

  .subtitle {
    font-size: 18px;
    color: #ffcc99;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
    opacity: 0.9;
  }

  .info-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 25px;
    margin: 50px 0;
  }

  .info-card {
    background: linear-gradient(145deg, 
      rgba(30, 30, 30, 0.9) 0%, 
      rgba(40, 40, 40, 0.9) 100%);
    border-radius: 15px;
    padding: 25px 20px;
    border: 1px solid rgba(255, 102, 0, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
  }

  .info-card:hover {
    transform: translateY(-8px);
    background: linear-gradient(145deg, 
      rgba(40, 30, 10, 0.9) 0%, 
      rgba(50, 40, 20, 0.9) 100%);
    border-color: rgba(255, 102, 0, 0.4);
    box-shadow: 
      0 15px 30px rgba(255, 102, 0, 0.2),
      0 0 0 1px rgba(255, 102, 0, 0.3);
  }

  .info-label {
    font-size: 14px;
    color: #ff9933;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .info-label::before {
    content: '►';
    font-size: 10px;
    color: #ff6600;
  }

  .info-value {
    font-size: 22px;
    font-weight: bold;
    color: #ffffff;
    font-family: 'Roboto Mono', monospace;
  }

  .countdown-value {
    font-size: 26px;
    font-weight: bold;
    color: #ff6600;
    font-family: 'Courier New', 'Roboto Mono', monospace;
    letter-spacing: 3px;
    text-shadow: 0 0 20px rgba(255, 102, 0, 0.4);
    padding: 10px;
    background: rgba(255, 102, 0, 0.1);
    border-radius: 10px;
    border: 1px solid rgba(255, 102, 0, 0.3);
  }

  .actions-section {
    margin-top: 50px;
    padding-top: 35px;
    border-top: 1px solid rgba(255, 102, 0, 0.2);
  }

  .check-button {
    background: linear-gradient(45deg, #ff6600, #ff8c00);
    color: #000000;
    border: none;
    padding: 20px 40px;
    font-size: 18px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-width: 220px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    box-shadow: 
      0 10px 30px rgba(255, 102, 0, 0.3),
      inset 0 2px 0 rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;
  }

  .check-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.2), 
      transparent);
    transition: 0.5s;
  }

  .check-button:hover:not(:disabled) {
    transform: translateY(-4px);
    box-shadow: 
      0 15px 35px rgba(255, 102, 0, 0.4),
      inset 0 2px 0 rgba(255, 255, 255, 0.3);
    background: linear-gradient(45deg, #ff8c00, #ffa500);
  }

  .check-button:hover:not(:disabled)::before {
    left: 100%;
  }

  .check-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #ff6600;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .hint {
    font-size: 14px;
    color: #ff9933;
    margin-top: 20px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.5;
    opacity: 0.8;
    font-style: italic;
  }

  .debug-section {
    margin-top: 40px;
    padding: 25px;
    background: rgba(10, 10, 10, 0.9);
    border-radius: 15px;
    text-align: left;
    border: 1px solid rgba(255, 102, 0, 0.2);
  }

  .debug-section h3 {
    margin-top: 0;
    color: #ff9933;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .debug-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .debug-actions button {
    background: linear-gradient(45deg, #222, #333);
    color: #ffcc99;
    border: 1px solid rgba(255, 102, 0, 0.3);
    padding: 10px 18px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;
    font-family: 'Courier New', monospace;
    font-weight: 600;
  }

  .debug-actions button:hover {
    background: linear-gradient(45deg, #333, #444);
    color: #ff6600;
    border-color: rgba(255, 102, 0, 0.5);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .no-trainings-container {
      padding: 20px 15px;
      align-items: flex-start;
    }
    
    .no-trainings-content {
      padding: 30px 20px;
      margin: 10px 0;
    }
    
    h1 {
      font-size: 32px;
    }
    
    .icon {
      font-size: 60px;
    }
    
    .info-section {
      grid-template-columns: 1fr;
      gap: 20px;
      margin: 30px 0;
    }
    
    .check-button {
      width: 100%;
      padding: 18px 30px;
    }
    
    .debug-actions {
      flex-direction: column;
    }
    
    .debug-actions button {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 28px;
    }
    
    .subtitle {
      font-size: 16px;
    }
    
    .no-trainings-content {
      padding: 25px 15px;
    }
    
    .info-value {
      font-size: 20px;
    }
    
    .countdown-value {
      font-size: 22px;
      letter-spacing: 2px;
    }
  }
`;

export default NoTrainingsDisplay;