import { useState, useEffect } from 'react';
import { formatTime, getCurrentDay } from '../utils/helpers';

function DateTimeDisplay() {
  const [currentTime, setCurrentTime] = useState(formatTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '15px 25px',
      borderRadius: '10px',
      fontSize: '1.8rem',
      fontFamily: 'monospace',
      zIndex: 1000
    }}>
      <div>{getCurrentDay()}</div>
      <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{currentTime}</div>
    </div>
  );
}

export default DateTimeDisplay;