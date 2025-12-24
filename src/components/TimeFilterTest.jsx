// Создай файл: src/components/TimeFilterTest.jsx
import { useState } from 'react';

function TimeFilterTest() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Тестовые тренировки
  const testTrainings = [
    {
      id: 1,
      title: 'Текущая тренировка',
      start: new Date(currentTime.getTime() - 300000), // 5 мин назад
      end: new Date(currentTime.getTime() + 300000),   // через 5 мин
      status: 'current'
    },
    {
      id: 2,
      title: 'Следующая тренировка',
      start: new Date(currentTime.getTime() + 3600000), // через 1 час
      end: new Date(currentTime.getTime() + 4200000),   // через 1:10
      status: 'next'
    },
    {
      id: 3,
      title: 'Прошедшая тренировка',
      start: new Date(currentTime.getTime() - 7200000), // 2 часа назад
      end: new Date(currentTime.getTime() - 6600000),   // 1:50 назад
      status: 'past'
    }
  ];
  
  // Функция определения статуса (та же, что в api.js)
  const getTrainingStatus = (training) => {
    const now = currentTime;
    const start = new Date(training.start);
    const end = new Date(training.end);
    const bufferStart = new Date(start.getTime() - 60000);
    const bufferEnd = new Date(end.getTime() + 60000);
    
    if (now >= bufferStart && now <= bufferEnd) {
      return 'current';
    } else if (start > now) {
      return 'next';
    } else {
      return 'past';
    }
  };
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>🧪 Тест фильтрации по времени</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <div>Текущее время: {currentTime.toLocaleString()}</div>
        <button onClick={() => setCurrentTime(new Date())}>
          Сбросить на настоящее время
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {testTrainings.map(training => {
          const calculatedStatus = getTrainingStatus(training);
          const isCorrect = calculatedStatus === training.status;
          
          return (
            <div key={training.id} style={{
              padding: '15px',
              border: `2px solid ${isCorrect ? 'green' : 'red'}`,
              borderRadius: '10px',
              background: '#f5f5f5',
              minWidth: '250px'
            }}>
              <h3>{training.title}</h3>
              <div>Время: {training.start.toLocaleTimeString()} - {training.end.toLocaleTimeString()}</div>
              <div>Ожидаемый статус: <strong>{training.status}</strong></div>
              <div>Рассчитанный статус: <strong>{calculatedStatus}</strong></div>
              <div style={{ color: isCorrect ? 'green' : 'red' }}>
                {isCorrect ? '✅ Корректно' : '❌ Ошибка'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TimeFilterTest;