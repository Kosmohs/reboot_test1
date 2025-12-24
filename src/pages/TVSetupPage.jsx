// src/pages/TVSetupPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TVSetupPage.css'; // Создадим CSS для красоты

const TVSetupPage = () => {
  const navigate = useNavigate();
  
  // Данные которые у нас есть (из твоих JSON)
  const FIT_CLUB_CONFIG = {
    gym_id: 1,
    name: 'FIT CLUB',
    rooms: [
      {
        room_id: '8b550c93-cf91-11f0-92a9-005056015d0b',
        name: 'HIT ZONE',
        description: 'Зал высокой интенсивности',
        capacity: 16,
        tvs: [
          { id: 5, name: '1 ТV (Big)', number: '1' },
          { id: 6, name: '2 ТV (Big)', number: '2' },
          { id: 7, name: '3 ТV (Big)', number: '3' },
          { id: 8, name: '4 ТV (Big)', number: '4' },
          { id: 9, name: '5 ТV', number: '5' },
          { id: 10, name: '6 ТV', number: '6' },
          { id: 11, name: '7 TV', number: '7' },
          { id: 12, name: '8 ТV', number: '8' },
          { id: 13, name: '9 ТV', number: '9' },
          { id: 14, name: '10 ТV', number: '10' }
        ]
      },
      {
        room_id: '71a5eec2-a066-11f0-9298-005056015d0b',
        name: 'GYM ZONE',
        description: 'Основной тренажерный зал',
        capacity: 30,
        tvs: [
          { id: 1, name: '1 ТV (Big)', number: '1' },
          { id: 2, name: '2 ТV (Big)', number: '2' },
          { id: 3, name: '3 ТV (Big)', number: '3' },
          { id: 4, name: '1 ТV', number: '4' }
        ]
      }
    ]
  };
  
  // Состояния
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedTv, setSelectedTv] = useState(null);
  const [step, setStep] = useState(1); // 1 = выбор зала, 2 = выбор телевизора
  
  // Проверяем настройки
  useEffect(() => {
    const savedConfig = localStorage.getItem('tvConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        const useSaved = window.confirm(
          `Этот телевизор уже настроен:\n\n` +
          `📍 Зал: ${config.room_name}\n` +
          `📺 Телевизор: ${config.tv_name}\n\n` +
          `Использовать эти настройки?`
        );
        
        if (useSaved) {
          navigate('/smart');
        } else {
          // Пользователь хочет перенастроить
          localStorage.removeItem('tvConfig');
        }
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error);
      }
    }
  }, [navigate]);
  
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setSelectedTv(null);
    setStep(2);
  };
  
  const handleTvSelect = (tv) => {
    setSelectedTv(tv);
  };
  
  const handleSave = () => {
    if (!selectedRoom || !selectedTv) {
      alert('❗ Пожалуйста, выберите зал и телевизор');
      return;
    }
    
    const tvConfig = {
      // Основные параметры для API
      gym_id: FIT_CLUB_CONFIG.gym_id,
      room_id: selectedRoom.room_id,
      televisor_id: selectedTv.id,
      
      // Для отображения
      gym_name: FIT_CLUB_CONFIG.name,
      room_name: selectedRoom.name,
      tv_name: selectedTv.name,
      
      // Метаданные
      setup_date: new Date().toISOString()
    };
    
    // Сохраняем в телевизор
    localStorage.setItem('tvConfig', JSON.stringify(tvConfig));
    
    // Показываем успех
    alert(`✅ Отлично! Телевизор настроен.\n\n` +
          `🏋️‍♂️ Зал: ${selectedRoom.name}\n` +
          `📺 Телевизор: ${selectedTv.name}\n\n` +
          `Теперь этот телевизор будет показывать тренировки для выбранного зала.`);
    
    // Переходим к тренировкам
    navigate('/smart');
  };
  
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedTv(null);
    }
  };
  
  const handleReset = () => {
    if (window.confirm('🗑️ Сбросить все настройки этого телевизора?\n\nПосле сброса нужно будет настроить заново.')) {
      localStorage.removeItem('tvConfig');
      window.location.reload();
    }
  };
  
  return (
    <div className="tv-setup-page">
      {/* Шапка */}
      <div className="setup-header">
        <h1>📺 Настройка телевизора</h1>
        <p className="subtitle">Выберите где находится этот телевизор</p>
      </div>
      
      {/* Индикатор шагов */}
      <div className="steps-indicator">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-circle">1</div>
          <div className="step-label">Выбор зала</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-circle">2</div>
          <div className="step-label">Выбор телевизора</div>
        </div>
      </div>
      
      {/* Контент в зависимости от шага */}
      <div className="setup-content">
        {step === 1 && (
          <div className="step-content">
            <h2>📍 Шаг 1: В каком зале находится этот телевизор?</h2>
            <p className="step-description">Выберите зал из списка ниже:</p>
            
            <div className="rooms-grid">
              {FIT_CLUB_CONFIG.rooms.map(room => (
                <div
                  key={room.room_id}
                  className="room-card"
                  onClick={() => handleRoomSelect(room)}
                >
                  <div className="room-icon">🏋️‍♂️</div>
                  <div className="room-info">
                    <h3>{room.name}</h3>
                    <p>{room.description}</p>
                    <div className="room-details">
                      <span>📺 {room.tvs.length} телевизоров</span>
                      <span>👥 до {room.capacity} человек</span>
                      <span className="room-id-full">🆔 {room.room_id}</span>
                    </div>
                  </div>
                  <div className="room-select">
                    <button className="select-btn">Выбрать →</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="help-box">
              <p>💡 <strong>Не знаете какой зал выбрать?</strong></p>
              <p>Посмотрите на табличке у входа в зал или спросите у администратора.</p>
            </div>
          </div>
        )}
        
        {step === 2 && selectedRoom && (
          <div className="step-content">
            <h2>📺 Шаг 2: Какой это телевизор в зале "{selectedRoom.name}"?</h2>
            <p className="step-description">Найдите на телевизоре номер или выберите из списка:</p>
            
            <div className="tvs-grid">
              {selectedRoom.tvs.map(tv => (
                <div
                  key={tv.id}
                  className={`tv-card ${selectedTv?.id === tv.id ? 'selected' : ''}`}
                  onClick={() => handleTvSelect(tv)}
                >
                  <div className="tv-icon">📺</div>
                  <div className="tv-info">
                    <h3>Телевизор {tv.number}</h3>
                    <p>{tv.name}</p>
                    <div className="tv-id">ID: {tv.id}</div>
                  </div>
                  <div className="tv-check">
                    {selectedTv?.id === tv.id && '✅'}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Подсказка */}
            <div className="help-box">
              <p>🔍 <strong>Как найти номер телевизора?</strong></p>
              <p>Обычно номер написан на наклейке на задней панели или на стене под телевизором.</p>
              <p>Если не можете найти - спросите у администратора.</p>
            </div>
            
            {/* Предпросмотр настроек */}
            {selectedTv && (
              <div className="preview-box">
                <h3>📋 Настройки которые будут сохранены:</h3>
                <div className="preview-content">
                  <div className="preview-item">
                    <span>🏢 Фитнес-клуб:</span>
                    <strong>{FIT_CLUB_CONFIG.name}</strong>
                  </div>
                  <div className="preview-item">
                    <span>📍 Зал:</span>
                    <strong>{selectedRoom.name}</strong>
                  </div>
                  <div className="preview-item">
                    <span>🆔 ID комнаты:</span>
                    <strong className="room-id-preview">{selectedRoom.room_id}</strong>
                  </div>
                  <div className="preview-item">
                    <span>📺 Телевизор:</span>
                    <strong>{selectedTv.name} (ID: {selectedTv.id})</strong>
                  </div>
                </div>
              </div>
            )}
            
            {/* Кнопки действий */}
            <div className="action-buttons">
              <button onClick={handleBack} className="btn-back">
                ← Назад к выбору зала
              </button>
              <button 
                onClick={handleSave} 
                className="btn-save"
                disabled={!selectedTv}
              >
                💾 Сохранить настройки
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Футер с инструкцией */}
      <div className="setup-footer">
        <div className="instruction-card">
          <h3>📖 Краткая инструкция:</h3>
          <ol>
            <li><strong>Выберите зал</strong> где висит этот телевизор</li>
            <li><strong>Выберите номер телевизора</strong> в этом зале</li>
            <li><strong>Нажмите "Сохранить настройки"</strong></li>
            <li>Готово! Телевизор запомнит настройки и будет показывать тренировки.</li>
          </ol>
        </div>
        
        <div className="warning-card">
          <h3>⚠️ Важно!</h3>
          <p>Если телевизор перенесут в другой зал - нужно будет заново настроить.</p>
          <button onClick={handleReset} className="btn-reset">
            🗑️ Сбросить все настройки
          </button>
        </div>
      </div>
    </div>
  );
};

export default TVSetupPage;