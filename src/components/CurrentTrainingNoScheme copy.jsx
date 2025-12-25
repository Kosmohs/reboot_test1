// src/components/CurrentTrainingNoScheme.jsx
import { useEffect, useState } from 'react';

function CurrentTrainingNoScheme({ trainingData }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Обновляем время каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Функция форматирования времени
  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long'
      });
    } catch (error) {
      return '';
    }
  };

  return (
    <div style={styles.container}>
      {/* Шапка с лого и временем */}
      <div style={styles.header}>
        <div style={styles.logo}>REBOOT STUDIO</div>
        <div style={styles.headerRight}>
          <div style={styles.currentTime}>
            {currentTime.toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
          <div style={styles.liveBadge}>LIVE</div>
        </div>
      </div>

      {/* Основной контент */}
      <div style={styles.content}>
        <div style={styles.date}>
          {formatDate(trainingData.trainingInfo?.time)}
        </div>
        
        <h1 style={styles.title}>
          {trainingData.trainingInfo?.name || 'HIT ZONE ТРЕНИРОВКА'}
        </h1>

        <div style={styles.timeSection}>
          <div style={styles.timeLabel}>ВРЕМЯ</div>
          <div style={styles.timeValue}>
            {formatTime(trainingData.trainingInfo?.time)} — {formatTime(trainingData.trainingInfo?.endTime)}
          </div>
        </div>

        <div style={styles.infoSection}>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>ТРЕНЕР</div>
            <div style={styles.infoValue}>{trainingData.trainingInfo?.trainer || '—'}</div>
          </div>
          
          {trainingData.clientCount > 0 && (
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>УЧАСТНИКИ</div>
              <div style={styles.infoValue}>{trainingData.clientCount}</div>
            </div>
          )}
        </div>

        {/* Сообщение о схеме */}
        <div style={styles.messageCard}>
          <div style={styles.messageIcon}>⚙️</div>
          <div style={styles.messageContent}>
            <div style={styles.messageTitle}>Схема не настроена</div>
            <div style={styles.messageText}>
              Тренировка проходит под руководством тренера
            </div>
          </div>
        </div>
      </div>

      {/* Футер */}
      <div style={styles.footer}>
        <div style={styles.zoneBadge}>HIT ZONE</div>
        <div style={styles.footerHint}>
          Система автоматически обновится при появлении данных
        </div>
      </div>
    </div>
  );
}

// Стили в черно-оранжевой гамме
const styles = {
  container: {
    height: '100vh',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    borderBottom: '1px solid #1a1a1a'
  },
  logo: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#FF8C00',
    letterSpacing: '1px'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  currentTime: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#FFFFFF'
  },
  liveBadge: {
    backgroundColor: '#FF8C00',
    color: '#000000',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto'
  },
  date: {
    fontSize: '16px',
    color: '#FF8C00',
    marginBottom: '30px',
    opacity: 0.8
  },
  title: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#FFFFFF',
    margin: '0 0 50px 0',
    lineHeight: '1.1',
    textTransform: 'uppercase'
  },
  timeSection: {
    marginBottom: '50px'
  },
  timeLabel: {
    fontSize: '14px',
    color: '#FF8C00',
    marginBottom: '10px',
    letterSpacing: '2px',
    opacity: 0.7
  },
  timeValue: {
    fontSize: '36px',
    fontWeight: '600',
    color: '#FFFFFF'
  },
  infoSection: {
    display: 'flex',
    gap: '30px',
    marginBottom: '50px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  infoCard: {
    backgroundColor: '#111111',
    borderRadius: '8px',
    padding: '25px',
    minWidth: '200px'
  },
  infoLabel: {
    fontSize: '12px',
    color: '#FF8C00',
    marginBottom: '10px',
    letterSpacing: '1px',
    opacity: 0.7
  },
  infoValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#FFFFFF'
  },
  messageCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    backgroundColor: 'rgba(255, 140, 0, 0.05)',
    border: '1px solid rgba(255, 140, 0, 0.2)',
    borderRadius: '8px',
    padding: '25px',
    maxWidth: '500px'
  },
  messageIcon: {
    fontSize: '32px'
  },
  messageContent: {
    textAlign: 'left'
  },
  messageTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#FF8C00',
    marginBottom: '5px'
  },
  messageText: {
    fontSize: '14px',
    color: '#CCCCCC',
    lineHeight: '1.4'
  },
  footer: {
    padding: '25px 40px',
    borderTop: '1px solid #1a1a1a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  zoneBadge: {
    backgroundColor: '#111111',
    color: '#FF8C00',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '1px'
  },
  footerHint: {
    fontSize: '12px',
    color: '#666666',
    opacity: 0.6
  }
};

export default CurrentTrainingNoScheme;