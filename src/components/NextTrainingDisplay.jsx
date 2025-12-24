// src/components/NextTrainingDisplay.jsx
import { useState, useEffect, useCallback } from 'react';
import { loadHitZoneLayout } from '../utils/training-data';

function NextTrainingDisplay({ trainingData }) {
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const [nextTraining, setNextTraining] = useState(trainingData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Форматирование времени
//   const formatTime = (dateString) => {
//     if (!dateString) return '--:--';
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
//   };

    // ДОБАВЛЯЕМ ЭТУ ФУНКЦИЮ СРАЗУ ПОСЛЕ useState:
  const refreshData = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    console.log('🔄 Обновление данных тренировки...');
    
    try {
      const newData = await loadHitZoneLayout({ useCacheAsFallback: false });
      setNextTraining(newData);
      console.log('✅ Данные обновлены, статус:', newData.status);
    } catch (error) {
      console.error('❌ Ошибка обновления данных:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

    // В NextTrainingDisplay.jsx, добавь функцию:
    const formatTime = (dateInput) => {
    if (!dateInput) return '--:--';
    
    try {
        let date;
        
        // Если это уже Date объект
        if (dateInput instanceof Date) {
        date = dateInput;
        } 
        // Если это строка
        else if (typeof dateInput === 'string') {
        if (dateInput.includes('T') || dateInput.includes('-')) {
            // ISO формат
            date = new Date(dateInput);
        } else if (dateInput.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)) {
            // Формат API
            date = new Date(dateInput.replace(' ', 'T') + ':00');
        } else {
            // Простой формат времени
            const today = new Date();
            const [hours, minutes] = dateInput.split(':');
            date = new Date(today);
            date.setHours(parseInt(hours) || 0, parseInt(minutes) || 0, 0, 0);
        }
        } else {
        console.warn('Неизвестный формат времени:', dateInput);
        return '--:--';
        }
        
        if (isNaN(date.getTime())) {
        return String(dateInput); // Возвращаем как есть если не распарсилось
        }
        
        return date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
        });
    } catch (error) {
        console.error('Ошибка форматирования времени:', error, 'Входные данные:', dateInput);
        return String(dateInput);
    }
    };

  // Рассчёт оставшегося времени
  // В функции calculateTimeLeft в NextTrainingDisplay.jsx:
    const calculateTimeLeft = useCallback(() => {
        // Пробуем получить время из разных мест
        const timeSource = 
            nextTraining?.trainingInfo?.time || 
            nextTraining?.rawData?.StartDate ||
            nextTraining?.time;
            
        if (!timeSource) {
            return { hours: '00', minutes: '00', seconds: '00' };
        }

        try {
            let startTime;
            const parseDate = (dateString) => {
            if (!dateString) return null;
            
            if (dateString.includes('T') || dateString.includes('-')) {
                return new Date(dateString);
            }
            
            if (dateString.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)) {
                return new Date(dateString.replace(' ', 'T') + ':00');
            }
            
            const today = new Date();
            const [hours, minutes] = dateString.split(':');
            const result = new Date(today);
            result.setHours(parseInt(hours) || 0, parseInt(minutes) || 0, 0, 0);
            
            if (result < today) {
                result.setDate(result.getDate() + 1);
            }
            
            return result;
            };
            
            startTime = parseDate(timeSource);
            
            if (!startTime || isNaN(startTime.getTime())) {
                return { hours: '--', minutes: '--', seconds: '--' };
            }
            
            const now = new Date();
            const difference = startTime - now;

            // ЕСЛИ ВРЕМЯ НАСТУПИЛО - ПРОСТО ПОКАЗЫВАЕМ 00:00:00
            if (difference <= 0) {
                return { hours: '00', minutes: '00', seconds: '00' };
            }

            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            return {
            hours: Math.max(0, hours).toString().padStart(2, '0'),
            minutes: Math.max(0, minutes).toString().padStart(2, '0'),
            seconds: Math.max(0, seconds).toString().padStart(2, '0')
            };
            
        } catch (error) {
            console.error('❌ Ошибка расчета времени:', error);
            return { hours: '--', minutes: '--', seconds: '--' };
        }
    }, [nextTraining]); // ← ТОЛЬКО nextTraining, без refreshData

  // Запуск таймера
  useEffect(() => {
    // Первоначальный расчёт
    setTimeLeft(calculateTimeLeft());

    // Таймер обновления каждую секунду
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Планируем обновление данных за 1 минуту до начала
    if (nextTraining?.trainingInfo?.time) {
      const startTime = new Date(nextTraining.trainingInfo.time);
      const now = new Date();
      const timeUntilRefresh = startTime - now - 60000; // за 1 минуту до начала

      if (timeUntilRefresh > 0) {
        // console.log(`⏰ Запланировано обновление за 1 минуту до начала: ${formatTime(startTime)}`);
        console.log(`⏰ Запланировано обновление за 1 минуту до начала: ${formatTime(nextTraining.trainingInfo.time)}`);
        const refreshTimer = setTimeout(() => {
          refreshData();
        }, timeUntilRefresh);

        return () => {
          clearTimeout(refreshTimer);
          clearInterval(timer);
        };
      }
    }

    return () => clearInterval(timer);
  }, [calculateTimeLeft, nextTraining, refreshData]);

  // Если статус изменился на 'current', показываем другой компонент
//   if (nextTraining?.status === 'current') {
//     console.log('🎯 Статус изменился на "current", нужно переключиться на тренировку');
//     // Здесь можно вернуть null и позволить родительскому компоненту переключиться
//     return null;
//   }

  // Если нет данных о следующей тренировке
  if (!nextTraining || !nextTraining.trainingInfo) {
    return (
      <div className="next-training-container">
        <div className="next-training-content">
          <h1>Нет данных о следующей тренировке</h1>
          <button onClick={refreshData} disabled={isRefreshing}>
            {isRefreshing ? 'Обновление...' : 'Обновить'}
          </button>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  const { trainingInfo, programData } = nextTraining;
  const isStartingSoon = parseInt(timeLeft.hours) === 0 && parseInt(timeLeft.minutes) < 5;

  // В JSX компонента, перед return, добавим отладку:
    console.log('🔍 NextTrainingDisplay данные:', {
        hasTraining: !!nextTraining,
        time: nextTraining?.trainingInfo?.time,
        endTime: nextTraining?.trainingInfo?.endTime,
        parsedTime: nextTraining?.trainingInfo?.time ? new Date(nextTraining.trainingInfo.time) : 'нет',
        now: new Date(),
        timeLeft: timeLeft
    });

  return (
    <div className="next-training-container">
      <div className="next-training-content">
        {/* Шапка */}
        <div className="training-header">
          <div className="header-label">Следующая тренировка</div>
          <h1 className="training-title">{trainingInfo.name || 'HIT ZONE'}</h1>
          <div className="training-time">
            {formatTime(trainingInfo.time)}
            {trainingInfo.endTime && ` - ${formatTime(trainingInfo.endTime)}`}
          </div>
        </div>

        {/* Таймер обратного отсчёта */}
        <div className={`countdown-container ${isStartingSoon ? 'starting-soon' : ''}`}>
          <div className="countdown-label">До начала осталось:</div>
          <div className="countdown">
            <div className="countdown-item">
              <span className="countdown-value">{timeLeft.hours}</span>
              <span className="countdown-label-small">часов</span>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <span className="countdown-value">{timeLeft.minutes}</span>
              <span className="countdown-label-small">минут</span>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <span className="countdown-value">{timeLeft.seconds}</span>
              <span className="countdown-label-small">секунд</span>
            </div>
          </div>
          {isStartingSoon && (
            <div className="starting-soon-alert">🚀 Скоро начинаем!</div>
          )}
        </div>

        {/* Детали тренировки */}
        <div className="training-details">
          <div className="detail-row">
            <span className="detail-label">Тренер:</span>
            <span className="detail-value">{trainingInfo.trainer}</span>
          </div>
          {programData.description && (
            <div className="detail-row">
              <span className="detail-label">Описание:</span>
              <span className="detail-value">{programData.description}</span>
            </div>
          )}
          {nextTraining.clientCount > 0 && (
            <div className="detail-row">
              <span className="detail-label">Участников:</span>
              <span className="detail-value">{nextTraining.clientCount}</span>
            </div>
          )}
        </div>

        {/* Кнопка обновления */}
        <div className="refresh-section">
          <button 
            className="refresh-button" 
            onClick={refreshData}
            disabled={isRefreshing}
          >
            {isRefreshing ? '🔄 Обновление...' : '🔄 Обновить сейчас'}
          </button>
          <div className="refresh-hint">
            Данные обновятся автоматически за 1 минуту до начала
          </div>
        </div>

        {/* Отладочная информация (только в разработке) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-info">
            <div>Статус: {nextTraining.status}</div>
            <div>Источник: {nextTraining.source}</div>
            <div>Layout: {nextTraining.layout}</div>
            <button onClick={() => console.log('Данные:', nextTraining)}>
              Показать данные в консоли
            </button>
          </div>
        )}
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .next-training-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: white;
    font-family: 'Arial', sans-serif;
    padding: 20px;
  }

  .next-training-content {
    max-width: 800px;
    width: 100%;
    text-align: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 40px;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .training-header {
    margin-bottom: 40px;
  }

  .header-label {
    font-size: 18px;
    color: #64b5f6;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .training-title {
    font-size: 42px;
    margin: 10px 0;
    color: #4fc3f7;
    text-shadow: 0 2px 10px rgba(79, 195, 247, 0.3);
  }

  .training-time {
    font-size: 24px;
    color: #bbdefb;
    margin-top: 10px;
  }

  .countdown-container {
    margin: 40px 0;
    padding: 30px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    border: 1px solid rgba(100, 181, 246, 0.2);
  }

  .countdown-container.starting-soon {
    background: rgba(255, 193, 7, 0.1);
    border-color: #ffc107;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4); }
    70% { box-shadow: 0 0 0 20px rgba(255, 193, 7, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
  }

  .countdown-label {
    font-size: 20px;
    margin-bottom: 20px;
    color: #bbdefb;
  }

  .countdown {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    font-family: 'Courier New', monospace;
  }

  .countdown-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 100px;
  }

  .countdown-value {
    font-size: 64px;
    font-weight: bold;
    color: #4fc3f7;
    text-shadow: 0 0 20px rgba(79, 195, 247, 0.5);
    line-height: 1;
  }

  .countdown-label-small {
    font-size: 16px;
    margin-top: 8px;
    color: #90caf9;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .countdown-separator {
    font-size: 48px;
    color: #64b5f6;
    margin-top: -15px;
  }

  .starting-soon-alert {
    font-size: 20px;
    color: #ffc107;
    margin-top: 20px;
    font-weight: bold;
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .training-details {
    margin: 30px 0;
    text-align: left;
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 10px;
  }

  .detail-row {
    display: flex;
    margin: 10px 0;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .detail-row:last-child {
    border-bottom: none;
  }

  .detail-label {
    font-weight: bold;
    color: #90caf9;
    min-width: 120px;
  }

  .detail-value {
    color: #e3f2fd;
    flex: 1;
  }

  .refresh-section {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .refresh-button {
    background: linear-gradient(45deg, #2196f3, #21cbf3);
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 18px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .refresh-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(33, 150, 243, 0.4);
  }

  .refresh-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .refresh-hint {
    font-size: 14px;
    color: #90caf9;
    margin-top: 10px;
    opacity: 0.8;
  }

  .debug-info {
    margin-top: 30px;
    padding: 15px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    font-size: 12px;
    color: #ccc;
    text-align: left;
  }

  .debug-info button {
    margin-top: 10px;
    padding: 5px 10px;
    background: #333;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .next-training-content {
      padding: 20px;
    }
    
    .training-title {
      font-size: 32px;
    }
    
    .countdown-value {
      font-size: 48px;
    }
    
    .countdown-item {
      min-width: 80px;
    }
  }
`;

export default NextTrainingDisplay;