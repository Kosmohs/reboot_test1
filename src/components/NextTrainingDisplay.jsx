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

  // HTML cleaner
    const cleanHtml = (html) => {
        if (!html) return '';
        
        return html
            .replace(/<[^>]*>/g, ' ')    // Удаляем все HTML-теги
            .replace(/&nbsp;/g, ' ')     // Заменяем неразрывные пробелы
            .replace(/\s\s+/g, ' ')      // Убираем множественные пробелы
            .trim();                     // Обрезаем пробелы по краям
    };

//   // В JSX компонента, перед return, добавим отладку:
//     console.log('🔍 NextTrainingDisplay данные:', {
//         hasTraining: !!nextTraining,
//         time: nextTraining?.trainingInfo?.time,
//         endTime: nextTraining?.trainingInfo?.endTime,
//         parsedTime: nextTraining?.trainingInfo?.time ? new Date(nextTraining.trainingInfo.time) : 'нет',
//         now: new Date(),
//         timeLeft: timeLeft
//     });


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
              {/* <span className="detail-value">{programData.description}</span> */}
              <span className="detail-value">{cleanHtml(programData.description)}</span>
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
    align-items: flex-start; /* Изменил с center на flex-start */
    overflow-y: auto;
    height: 100%;
    
    background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%);
    color: #ffffff;
    font-family: 'Segoe UI', 'Arial', sans-serif;
    padding: 20px;
    box-sizing: border-box; /* Чтобы padding не увеличивал высоту */
  }

  .next-training-content {
    max-width: 900px;
    width: 100%;
    text-align: center;
    background: rgba(15, 15, 15, 0.85);
    border-radius: 24px;
    padding: 50px 40px;
    backdrop-filter: blur(12px);
    box-shadow: 
      0 15px 35px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 102, 0, 0.1);
    border: 1px solid rgba(255, 102, 0, 0.15);
    position: relative;
    overflow: hidden;
    margin-top: 20px; /* Отступ сверху */
    margin-bottom: 20px; /* Отступ снизу */
  }

  /* Остальные стили остаются без изменений */
  .next-training-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      #ff6600 0%, 
      #ff8c00 50%, 
      #ff6600 100%);
    z-index: 1;
  }

  .training-header {
    margin-bottom: 45px;
    position: relative;
  }

  .header-label {
    font-size: 16px;
    color: #ff8c00;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-weight: 600;
    text-shadow: 0 0 15px rgba(255, 102, 0, 0.3);
  }

  .training-title {
    font-size: 48px;
    margin: 15px 0;
    color: #ffffff;
    background: linear-gradient(45deg, #ffffff, #ffcc99);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 20px rgba(255, 102, 0, 0.2);
    font-weight: 700;
    line-height: 1.2;
  }

  .training-time {
    font-size: 26px;
    color: #ffcc99;
    margin-top: 15px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .training-time::before {
    content: '🕒';
    font-size: 20px;
  }

  .countdown-container {
    margin: 45px 0;
    padding: 35px;
    background: linear-gradient(145deg, 
      rgba(20, 20, 20, 0.9) 0%, 
      rgba(30, 30, 30, 0.9) 100%);
    border-radius: 20px;
    border: 1px solid rgba(255, 102, 0, 0.2);
    box-shadow: 
      inset 0 2px 10px rgba(0, 0, 0, 0.5),
      0 5px 20px rgba(255, 102, 0, 0.1);
  }

  .countdown-container.starting-soon {
    background: linear-gradient(145deg, 
      rgba(40, 20, 0, 0.9) 0%, 
      rgba(60, 30, 0, 0.9) 100%);
    border-color: #ff6600;
    border-width: 2px;
    animation: pulse-orange 2s infinite;
  }

  @keyframes pulse-orange {
    0% { 
      box-shadow: 
        0 0 0 0 rgba(255, 102, 0, 0.4),
        0 5px 25px rgba(255, 102, 0, 0.2); 
    }
    70% { 
      box-shadow: 
        0 0 0 20px rgba(255, 102, 0, 0),
        0 5px 25px rgba(255, 102, 0, 0.3); 
    }
    100% { 
      box-shadow: 
        0 0 0 0 rgba(255, 102, 0, 0),
        0 5px 25px rgba(255, 102, 0, 0.2); 
    }
  }

  .countdown-label {
    font-size: 22px;
    margin-bottom: 25px;
    color: #ffcc99;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .countdown {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    font-family: 'Roboto Mono', 'Courier New', monospace;
  }

  .countdown-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 110px;
  }

  .countdown-value {
    font-size: 72px;
    font-weight: 800;
    background: linear-gradient(45deg, #ff6600, #ff8c00, #ffcc00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 30px rgba(255, 102, 0, 0.4);
    line-height: 1;
    padding: 10px 5px;
    min-width: 120px;
    position: relative;
  }

  .countdown-value::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    right: 10%;
    height: 3px;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 102, 0, 0.5), 
      transparent);
    border-radius: 2px;
  }

  .countdown-label-small {
    font-size: 16px;
    margin-top: 12px;
    color: #ff9933;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 600;
    background: rgba(255, 102, 0, 0.1);
    padding: 6px 12px;
    border-radius: 10px;
    width: 100%;
  }

  .countdown-separator {
    font-size: 56px;
    color: #ff6600;
    margin-top: -20px;
    font-weight: bold;
    text-shadow: 0 0 15px rgba(255, 102, 0, 0.5);
  }

  .starting-soon-alert {
    font-size: 22px;
    color: #ff6600;
    margin-top: 25px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    animation: blink-orange 1.5s infinite;
    text-shadow: 0 0 10px rgba(255, 102, 0, 0.3);
  }

  @keyframes blink-orange {
    0%, 100% { 
      opacity: 1; 
      color: #ff6600;
    }
    50% { 
      opacity: 0.7; 
      color: #ffcc00;
    }
  }

  .starting-soon-alert::before {
    content: '⚠️';
    font-size: 24px;
  }

  .training-details {
    margin: 35px 0;
    text-align: left;
    background: rgba(25, 25, 25, 0.7);
    padding: 25px;
    border-radius: 15px;
    border: 1px solid rgba(255, 102, 0, 0.1);
  }

  .detail-row {
    display: flex;
    margin: 12px 0;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255, 102, 0, 0.15);
    align-items: center;
  }

  .detail-row:last-child {
    border-bottom: none;
  }

  .detail-label {
    font-weight: 700;
    color: #ff9933;
    min-width: 140px;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .detail-label::before {
    content: '▶';
    font-size: 12px;
    color: #ff6600;
  }

  .detail-value {
    color: #ffffff;
    flex: 1;
    font-size: 16px;
    line-height: 1.5;
  }

  .refresh-section {
    margin-top: 35px;
    padding-top: 25px;
    border-top: 1px solid rgba(255, 102, 0, 0.2);
  }

  .refresh-button {
    background: linear-gradient(45deg, #ff6600, #ff8c00);
    color: #000000;
    border: none;
    padding: 18px 40px;
    font-size: 18px;
    border-radius: 60px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    box-shadow: 
      0 8px 25px rgba(255, 102, 0, 0.3),
      inset 0 2px 0 rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;
  }

  .refresh-button::before {
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

  .refresh-button:hover:not(:disabled) {
    transform: translateY(-4px);
    box-shadow: 
      0 12px 30px rgba(255, 102, 0, 0.4),
      inset 0 2px 0 rgba(255, 255, 255, 0.3);
    background: linear-gradient(45deg, #ff8c00, #ffa500);
  }

  .refresh-button:hover:not(:disabled)::before {
    left: 100%;
  }

  .refresh-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .refresh-hint {
    font-size: 14px;
    color: #ff9933;
    margin-top: 15px;
    opacity: 0.9;
    font-style: italic;
  }

  .debug-info {
    margin-top: 35px;
    padding: 20px;
    background: rgba(10, 10, 10, 0.9);
    border-radius: 12px;
    font-size: 13px;
    color: #ffcc99;
    text-align: left;
    border: 1px solid rgba(255, 102, 0, 0.2);
    font-family: 'Courier New', monospace;
  }

  .debug-info button {
    margin-top: 12px;
    padding: 8px 16px;
    background: linear-gradient(45deg, #333, #444);
    color: #ff9933;
    border: 1px solid #ff6600;
    border-radius: 6px;
    cursor: pointer;
    font-family: inherit;
    font-weight: 600;
    transition: all 0.2s;
  }

  .debug-info button:hover {
    background: linear-gradient(45deg, #444, #555);
    color: #ffcc00;
  }

  @media (max-width: 768px) {
    .next-training-container {
      height: 100vh; /* На мобильных переходим на полную высоту */
      min-height: 100vh;
      max-height: 100vh;
      padding: 10px;
    }
    
    .next-training-content {
      padding: 30px 20px;
      margin: 10px 0;
    }
    
    .training-title {
      font-size: 36px;
    }
    
    .countdown-value {
      font-size: 52px;
      min-width: 90px;
    }
    
    .countdown-item {
      min-width: 85px;
    }
    
    .countdown {
      gap: 15px;
    }
    
    .countdown-separator {
      font-size: 40px;
      margin-top: -15px;
    }
    
    .detail-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }
    
    .detail-label {
      min-width: auto;
    }
    
    .refresh-button {
      width: 100%;
      justify-content: center;
      padding: 16px 30px;
    }
  }

  @media (max-width: 480px) {
    .training-title {
      font-size: 28px;
    }
    
    .countdown-value {
      font-size: 42px;
      min-width: 70px;
    }
    
    .countdown-item {
      min-width: 70px;
    }
    
    .countdown-label-small {
      font-size: 14px;
    }
    
    .countdown-separator {
      font-size: 32px;
      margin-top: -10px;
    }
  }
`;

export default NextTrainingDisplay;