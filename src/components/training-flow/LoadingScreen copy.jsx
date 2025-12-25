// src/components/training-flow/LoadingScreen.jsx
import React from 'react';
import logoImage from '../../assets/images/logo.svg';

function LoadingScreen({ tvConfig, error, onRetry }) {
  const TEST_MODE = false;
  const TEST_LAYOUT = 'scheme';

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorContent}>
          <div style={styles.errorIcon}>⚠️</div>
          <div style={styles.errorTitle}>Ошибка загрузки</div>
          <div style={styles.errorMessage}>{error}</div>
          <button 
            onClick={onRetry}
            style={styles.retryButton}
          >
            Перезагрузить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingContent}>
        {/* <div style={styles.logo}>Reboot STUDIO</div> */}
        <img src={logoImage} alt="REBOOT STUDIO" style={styles.logo}/>
        <div style={styles.loadingText}>Определение макета...</div>
        <div style={styles.loadingDetails}>
          {TEST_MODE ? `Тестовый режим: ${TEST_LAYOUT}` : 'Режим работы с API'}
        </div>
        <div style={styles.loadingConfig}>
          {/* Телевизор: {tvConfig?.televisor_id || '...'} | Зал: {tvConfig?.zone || '...'} */}
          Телевизор: {tvConfig?.televisor_id || '...'}
          Зал: {tvConfig?.zone || '...'}
        </div>
        <div style={styles.loadingSpinner}></div>
      </div>
    </div>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
//   loadingContent: {
//     textAlign: 'center',
//     maxWidth: '500px',
//     padding: '40px',
//     backgroundColor: 'rgba(255, 140, 0, 0.05)',
//     border: '1px solid rgba(255, 140, 0, 0.2)',
//     borderRadius: '12px',
//   },

  loadingContent: {
    textAlign: 'center',
    maxWidth: '600px',
    padding: '50px 30px', // увеличили паддинги
    backgroundColor: 'rgba(255, 140, 0, 0.05)',
    border: '1px solid rgba(255, 140, 0, 0.2)',
    borderRadius: '12px',
    width: '90%', // добавим ширину
    margin: '0 auto',
  },
//   logo: {
//     fontSize: '20px',
//     fontWeight: '800',
//     color: '#FF8C00',
//     marginBottom: '30px',
//     letterSpacing: '1px',
//   },
  logo: {
    height: '40px', // или нужная высота
    marginBottom: '30px',
    objectFit: 'contain',
    maxWidth: '200px', // ограничиваем ширину
  },
  loadingText: {
    fontSize: '24px',
    marginBottom: '20px',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingDetails: {
    fontSize: '16px',
    marginBottom: '15px',
    color: '#CCCCCC',
  },
//   loadingConfig: {
//     fontSize: '14px',
//     marginBottom: '30px',
//     color: '#999999',
//     backgroundColor: 'rgba(255, 140, 0, 0.1)',
//     padding: '8px 16px',
//     borderRadius: '6px',
//     display: 'inline-block',
//   },
  loadingConfig: {
    fontSize: '14px',
    marginBottom: '30px',
    color: '#999999',
    backgroundColor: 'rgba(255, 140, 0, 0.1)',
    padding: '12px 24px',
    borderRadius: '6px',
    display: 'inline-block',
    flexDirection: 'column',
    gap: '5px',
    maxWidth: '100%', // важно!
    wordBreak: 'break-word', // перенос длинных слов
    whiteSpace: 'normal', // разрешаем переносы
    lineHeight: '1.4',
    boxSizing: 'border-box',
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '3px solid rgba(255, 140, 0, 0.3)',
    borderRadius: '50%',
    borderTopColor: '#FF8C00',
    margin: '0 auto',
    animation: 'spin 1s ease-in-out infinite',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  errorContent: {
    textAlign: 'center',
    maxWidth: '500px',
    padding: '40px',
    backgroundColor: 'rgba(255, 140, 0, 0.05)',
    border: '1px solid rgba(255, 140, 0, 0.2)',
    borderRadius: '12px',
  },
  errorIcon: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#FF8C00',
  },
  errorMessage: {
    fontSize: '16px',
    marginBottom: '25px',
    color: '#CCCCCC',
    lineHeight: '1.5',
  },
  retryButton: {
    backgroundColor: '#FF8C00',
    color: '#000000',
    border: 'none',
    padding: '12px 30px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  '@keyframes spin': {
    to: { transform: 'rotate(360deg)' },
  },
};

// Добавляем стили для анимации в глобальные стили
const globalStyles = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

// Вставка глобальных стилей (в реальном проекте лучше через CSS файл)
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = globalStyles;
  document.head.appendChild(style);
}

export default LoadingScreen;