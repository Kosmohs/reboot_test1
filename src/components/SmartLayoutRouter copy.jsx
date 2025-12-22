// // src/components/SmartLayoutRouter.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { fetchTrainings, getCurrentTVConfig } from '../utils/api';
// import { groupProgramsByTime, determineLayout } from '../utils/program-grouper';


// function SmartLayoutRouter() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [tvConfig, setTvConfig] = useState(null);

//   // Получаем конфигурацию телевизора
//   useEffect(() => {
//     const config = getCurrentTVConfig();
//     setTvConfig(config);
//     console.log('SmartRouter: Конфигурация телевизора:', config);
//   }, []);

//   // Определяем и перенаправляем на нужную страницу
//   useEffect(() => {
//     const determineAndNavigate = async () => {
//       if (!tvConfig) return;

//       setLoading(true);
//       setError(null);

//       try {
//         // 1. Загружаем данные
//         const data = await fetchTrainings();
        
//         // 2. Группируем программы
//         const programs = groupProgramsByTime(data);
//         console.log('SmartRouter: Найдено программ:', programs.length);

//         if (programs.length === 0) {
//           // Нет программ - показываем Page1 с демо-данными
//           console.log('SmartRouter: Нет программ, перенаправляем на Page1');
//           navigate('/page1');
//           return;
//         }

//         // 3. Определяем макет
//         const layout = determineLayout(programs);
//         console.log('SmartRouter: Определен макет:', layout);

//         // 4. Перенаправляем на нужную страницу
//         switch (layout) {
//           case '3-programs':
//             navigate('/page1');
//             break;
//           case '2-programs':
//             navigate('/page1_3');
//             break;
//           case '1-program-small':
//             navigate('/page1_1');
//             break;
//           case '1-program-large':
//             navigate('/page1_2');
//             break;
//           default:
//             navigate('/page1');
//         }

//       } catch (err) {
//         console.error('SmartRouter: Ошибка:', err);
//         setError('Ошибка загрузки данных');
        
//         // // При ошибке показываем Page1
//         // navigate('/page1');
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Таймаут для перенаправления
//     const timeoutId = setTimeout(() => {
//       determineAndNavigate();
//     }, 500); // Маленькая задержка для стабильности

//     return () => clearTimeout(timeoutId);
//   }, [tvConfig, navigate]);

//   // Пока загрузка - можно показать лоадер
//   if (loading) {
//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         fontSize: '20px',
//         color: '#666'
//       }}>
//         Загрузка данных тренировки...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         fontSize: '20px',
//         color: 'red'
//       }}>
//         {error}
//       </div>
//     );
//   }

//   // Этот компонент сам не рендерит контент, только перенаправляет
//   return null;
// }

// export default SmartLayoutRouter;


// src/components/SmartLayoutRouter.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrainings, getCurrentTVConfig } from '../utils/api';
import { groupProgramsByTime, determineLayout, getTestPrograms } from '../utils/program-grouper';



function SmartLayoutRouter() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tvConfig, setTvConfig] = useState(null);
  
  // Переменная для тестирования разных макетов
  const TEST_MODE = true; // ← true = тестовый режим, false = работа с API
  const TEST_LAYOUT = '1-program-large'; // ← меняй здесь: '3-programs', '2-programs', '1-program-small', '1-program-large'

    // Установи TEST_MODE = true
    // Меняй TEST_LAYOUT на:
    // '3-programs' → должен идти на /page1
    // '2-programs' → должен идти на /page1_3
    // '1-program-small' → /page1_1
    // '1-program-large' → /page1_2
    // Открой http://localhost:5174/smart?tv_id=tv-1


  // Получаем конфигурацию телевизора
  useEffect(() => {
    const config = getCurrentTVConfig();
    setTvConfig(config);
    console.log('SmartRouter: Конфигурация телевизора:', config);
  }, []);

  // Определяем и перенаправляем на нужную страницу
  useEffect(() => {
    const determineAndNavigate = async () => {
      if (!tvConfig) return;

      setLoading(true);
      setError(null);

      try {
        let programs = [];
        
        if (TEST_MODE) {
          // ТЕСТОВЫЙ РЕЖИМ: используем тестовые данные
          console.log(`SmartRouter: ТЕСТОВЫЙ РЕЖИМ (${TEST_LAYOUT})`);
          programs = getTestPrograms(TEST_LAYOUT);
        } else {
          // РЕЖИМ РАБОТЫ С API: загружаем реальные данные
          console.log('SmartRouter: Загрузка данных с API...');
          const data = await fetchTrainings();
          programs = groupProgramsByTime(data);
        }
        
        console.log('SmartRouter: Найдено программ:', programs.length);
        console.log('SmartRouter: Данные программ:', programs);

        if (programs.length === 0) {
          // Нет программ - показываем Page1 с демо-данными
          console.log('SmartRouter: Нет программ, перенаправляем на Page1');
          navigate('/page1');
          return;
        }

        // Определяем макет
        const layout = determineLayout(programs);
        console.log('SmartRouter: Определен макет:', layout);

        // Перенаправляем на нужную страницу
        let targetPage = '/page1';
        
        switch (layout) {
          case '3-programs':
            targetPage = '/page1';
            break;
          case '2-programs':
            targetPage = '/page1_3';
            break;
          case '1-program-small':
            targetPage = '/page1_1';
            break;
          case '1-program-large':
            targetPage = '/page1_2';
            break;
          default:
            targetPage = '/page1';
        }
        
        console.log(`SmartRouter: Перенаправление на ${targetPage}`);
        
        // Добавляем данные программ в URL state чтобы передать на целевую страницу
        navigate(targetPage, { 
          state: { 
            programsData: programs,
            layoutType: layout,
            source: 'smart-router',
            skipLoading: true
          }
        });

      } catch (err) {
        console.error('SmartRouter: Ошибка:', err);
        setError('Ошибка загрузки данных');
        
        // При ошибке показываем Page1 с демо
        navigate('/page1', { 
          state: { 
            error: err.message,
            source: 'smart-router-error'
          }
        });
        
      } finally {
        setLoading(false);
      }
    };

    // Таймаут для перенаправления
    const timeoutId = setTimeout(() => {
      determineAndNavigate();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [tvConfig, navigate]);

  // Пока загрузка - можно показать лоадер
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '20px',
        color: '#666',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>Загрузка данных тренировки...</div>
        <div style={{ fontSize: '14px', color: '#999' }}>
          {TEST_MODE ? `Тестовый режим: ${TEST_LAYOUT}` : 'Режим работы с API'}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '20px',
        color: 'red'
      }}>
        {error}
      </div>
    );
  }

  // Этот компонент сам не рендерит контент, только перенаправляет
  return null;
}

export default SmartLayoutRouter;