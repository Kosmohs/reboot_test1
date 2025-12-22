// Создайте новый компонент DebugPage1.jsx:
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Page1 from './Page1';

export default function DebugPage1() {
  const location = useLocation();
  
  useEffect(() => {
    console.log('🔍 DebugPage1: location обновился');
    console.log('🔍 pathname:', location.pathname);
    console.log('🔍 state:', location.state);
    console.log('🔍 state?.hitZoneData:', location.state?.hitZoneData);
    console.log('🔍 state?.timestamp:', location.state?.timestamp);
    console.log('🔍 История:', window.history.state);
  }, [location]);
  
  return <Page1 />;
}

// И в App.jsx замените:
<Route path="/page1" element={<DebugPage1 />} />