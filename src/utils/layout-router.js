// src/utils/layout-router.js
import { determineLayout, formatDataForLayout } from './program-grouper';

/**
 * Получает информацию о макете для данных
 */
export function getLayoutInfo(programs) {
  const layoutType = determineLayout(programs);
  const formattedData = formatDataForLayout(programs, layoutType);
  
  return {
    layoutType,
    formattedData,
    pageComponent: getPageComponent(layoutType)
  };
}

/**
 * Возвращает компонент страницы по типу макета
 */
function getPageComponent(layoutType) {
  switch (layoutType) {
    case '3-programs':
      return 'Page1'; // page1.jsx
    case '2-programs':
      return 'Page1_3'; // page1_3.jsx
    case '1-program-small':
      return 'Page1_1'; // page1_1.jsx
    case '1-program-large':
      return 'Page1_2'; // page1_2.jsx
    default:
      return 'NoDataPage';
  }
}

/**
 * Роутер для App.jsx
 */
export async function routeToLayout(programs, navigate) {
  const layoutInfo = getLayoutInfo(programs);
  
  // В зависимости от фреймворка навигации
  // Например, для React Router:
  // navigate(`/${layoutInfo.pageComponent.toLowerCase()}`);
  
  return layoutInfo;
}