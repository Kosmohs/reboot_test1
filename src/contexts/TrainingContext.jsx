// // src/contexts/TrainingContext.jsx
// import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
// import { apiService } from '../services/api.service';

// const TrainingContext = createContext();

// export const useTraining = () => {
//   const context = useContext(TrainingContext);
//   if (!context) {
//     throw new Error('useTraining must be used within TrainingProvider');
//   }
//   return context;
// };

// export const TrainingProvider = ({ children }) => {
//   const [state, setState] = useState({
//     // Данные
//     gyms: [],
//     televisors: [],
//     trainings: [],
//     rooms: [],
//     news: [],
//     clients: [],
    
//     // Выбранные значения
//     selectedGym: null,
//     selectedTelevisor: null,
//     selectedTraining: null,
//     currentRound: 1,
    
//     // Состояние
//     isLoading: false,
//     error: null,
//     lastUpdate: null
//   });

//   // ========== ОСНОВНЫЕ ФУНКЦИИ ==========

//   // Загрузка всех залов
//   const loadGyms = useCallback(async () => {
//     setState(prev => ({ ...prev, isLoading: true, error: null }));
    
//     try {
//       const response = await apiService.getGyms();
//       const gyms = response.data || response;
      
//       setState(prev => ({ 
//         ...prev, 
//         gyms,
//         selectedGym: gyms.length > 0 ? gyms[0] : null
//       }));
      
//       // Если есть зал, загружаем телевизоры
//       if (gyms.length > 0) {
//         await loadTelevisors(gyms[0].id);
//       }
      
//       return gyms;
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: 'Ошибка загрузки залов' 
//       }));
//       throw error;
//     } finally {
//       setState(prev => ({ ...prev, isLoading: false }));
//     }
//   }, []);

//   // Загрузка телевизоров для зала
//   const loadTelevisors = useCallback(async (gymId) => {
//     if (!gymId) return;
    
//     setState(prev => ({ ...prev, isLoading: true, error: null }));
    
//     try {
//       const response = await apiService.getTelevisors(gymId);
//       const televisors = response.data || response;
      
//       setState(prev => ({ 
//         ...prev, 
//         televisors,
//         selectedTelevisor: televisors.length > 0 ? televisors[0] : null
//       }));
      
//       // Если есть телевизор, загружаем тренировки
//       if (televisors.length > 0) {
//         await loadTrainings(gymId, televisors[0].id);
//       }
      
//       return televisors;
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: 'Ошибка загрузки телевизоров' 
//       }));
//       throw error;
//     } finally {
//       setState(prev => ({ ...prev, isLoading: false }));
//     }
//   }, []);

//   // Загрузка тренировок
//   const loadTrainings = useCallback(async (gymId, televisorId) => {
//     if (!gymId || !televisorId) return;
    
//     setState(prev => ({ ...prev, isLoading: true, error: null }));
    
//     try {
//       const response = await apiService.getTrainings(gymId, televisorId);
//       const trainings = response.data || response;
      
//       setState(prev => ({ 
//         ...prev, 
//         trainings,
//         selectedTraining: trainings.length > 0 ? trainings[0] : null,
//         lastUpdate: new Date().toISOString()
//       }));
      
//       return trainings;
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: 'Ошибка загрузки тренировок' 
//       }));
//       throw error;
//     } finally {
//       setState(prev => ({ ...prev, isLoading: false }));
//     }
//   }, []);

//   // Загрузка комнат
//   const loadRooms = useCallback(async () => {
//     setState(prev => ({ ...prev, isLoading: true }));
    
//     try {
//       const response = await apiService.getRooms();
//       const rooms = response.data || response;
      
//       setState(prev => ({ ...prev, rooms }));
//       return rooms;
//     } catch (error) {
//       console.error('Error loading rooms:', error);
//       return [];
//     } finally {
//       setState(prev => ({ ...prev, isLoading: false }));
//     }
//   }, []);

//   // Загрузка новостей
//   const loadNews = useCallback(async (gymId) => {
//     if (!gymId) return;
    
//     try {
//       const response = await apiService.getNews(gymId);
//       const news = response.data || response;
      
//       setState(prev => ({ ...prev, news }));
//       return news;
//     } catch (error) {
//       console.error('Error loading news:', error);
//       return [];
//     }
//   }, []);

//   // ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

//   // Выбор зала
//   const selectGym = useCallback(async (gym) => {
//     setState(prev => ({ 
//       ...prev, 
//       selectedGym: gym,
//       televisors: [],
//       trainings: [],
//       selectedTelevisor: null,
//       selectedTraining: null
//     }));
    
//     await loadTelevisors(gym.id);
//   }, [loadTelevisors]);

//   // Выбор телевизора
//   const selectTelevisor = useCallback(async (televisor) => {
//     if (!state.selectedGym) return;
    
//     setState(prev => ({ 
//       ...prev, 
//       selectedTelevisor: televisor,
//       trainings: [],
//       selectedTraining: null
//     }));
    
//     await loadTrainings(state.selectedGym.id, televisor.id);
//   }, [state.selectedGym, loadTrainings]);

//   // Следующий раунд
//   const nextRound = useCallback(() => {
//     setState(prev => {
//       if (!prev.selectedTraining?.totalRounds) return prev;
      
//       const currentRound = prev.currentRound;
//       const totalRounds = prev.selectedTraining.totalRounds || 8;
      
//       if (currentRound < totalRounds) {
//         return { ...prev, currentRound: currentRound + 1 };
//       }
//       return prev;
//     });
//   }, []);

//   // Предыдущий раунд
//   const prevRound = useCallback(() => {
//     setState(prev => {
//       if (prev.currentRound > 1) {
//         return { ...prev, currentRound: prev.currentRound - 1 };
//       }
//       return prev;
//     });
//   }, []);

//   // Сброс раундов
//   const resetRounds = useCallback(() => {
//     setState(prev => ({ ...prev, currentRound: 1 }));
//   }, []);

//   // Обновление данных
//   const refreshData = useCallback(async () => {
//     if (state.selectedGym && state.selectedTelevisor) {
//       await loadTrainings(state.selectedGym.id, state.selectedTelevisor.id);
//     }
//   }, [state.selectedGym, state.selectedTelevisor, loadTrainings]);

//   // ========== ЭФФЕКТЫ ==========

//   // Инициализация при загрузке
//   useEffect(() => {
//     const initialize = async () => {
//       await loadGyms();
//       await loadRooms();
//     };
    
//     initialize();
    
//     // Опционально: обновление каждые 30 секунд
//     const interval = setInterval(refreshData, 30000);
//     return () => clearInterval(interval);
//   }, [loadGyms, loadRooms, refreshData]);

//   // ========== ПРЕДОСТАВЛЯЕМЫЕ ДАННЫЕ ==========

//   const value = {
//     // Данные
//     ...state,
    
//     // Функции загрузки
//     loadGyms,
//     loadTelevisors,
//     loadTrainings,
//     loadRooms,
//     loadNews,
//     refreshData,
    
//     // Функции выбора
//     selectGym,
//     selectTelevisor,
    
//     // Функции раундов
//     nextRound,
//     prevRound,
//     resetRounds,
    
//     // Вспомогательные функции
//     getCurrentTraining: () => state.selectedTraining,
//     getTotalRounds: () => state.selectedTraining?.totalRounds || 8,
//     getClientsForTraining: (trainingId) => {
//       // Здесь будет логика получения клиентов для тренировки
//       return state.clients.filter(client => client.trainingId === trainingId);
//     }
//   };

//   return (
//     <TrainingContext.Provider value={value}>
//       {children}
//     </TrainingContext.Provider>
//   );
// };

// export default TrainingContext;



// src/contexts/TrainingContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { apiService } from '../services/api.service';

const TrainingContext = createContext();

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTraining must be used within TrainingProvider');
  }
  return context;
};

// Временные мок-данные для разработки
const mockData = {
  gyms: [
    {
      id: 1,
      name: "Reboot Central Auenue",
      address: "Сейфуллина 574/3",
      phone: "77017211313"
    }
  ],
  televisors: [
    { id: 1, name: "Экран 1", gym_id: 1 },
    { id: 2, name: "Экран 2", gym_id: 1 }
  ],
  trainings: [
    {
      id: 'mock-1',
      training: {
        program: {
          trainings: [
            { 
              code: '2A|2B',
              partA: '2A',
              partB: '2B',
              name: 'Силовая тренировка'
            }
          ]
        }
      },
      Clients: [
        { ID: 'client-1', Name: 'Анна Смирнова' },
        { ID: 'client-2', Name: 'Иван Петров' }
      ],
      totalRounds: 8,
      timers: { work: 30, rest: 15 }
    },
    {
      id: 'mock-2',
      training: {
        program: {
          trainings: [
            { 
              code: '2C|2D',
              partA: '2C',
              partB: '2D',
              name: 'Кардио тренировка'
            }
          ]
        }
      },
      Clients: [
        { ID: 'client-3', Name: 'Мария Иванова' },
        { ID: 'client-4', Name: 'Сергей Козлов' }
      ],
      totalRounds: 6,
      timers: { work: 45, rest: 20 }
    }
  ]
};

export const TrainingProvider = ({ children }) => {
  const [state, setState] = useState({
    // Данные
    gyms: mockData.gyms,
    televisors: mockData.televisors,
    trainings: mockData.trainings,
    rooms: [],
    news: [],
    clients: [],
    
    // Выбранные значения
    selectedGym: mockData.gyms[0],
    selectedTelevisor: mockData.televisors[0],
    selectedTraining: mockData.trainings[0],
    currentRound: 1,
    
    // Состояние
    
    isLoading: false,
    error: null,
    lastUpdate: null
  });

  // ========== ОСНОВНЫЕ ФУНКЦИИ ==========

  // Загрузка всех залов
  const loadGyms = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // ВРЕМЕННО: используем мок-данные
      const gyms = mockData.gyms;
      
      setState(prev => ({ 
        ...prev, 
        gyms,
        selectedGym: gyms.length > 0 ? gyms[0] : null
      }));
      
      // ВРЕМЕННО: сразу загружаем тренировки
      if (gyms.length > 0) {
        setState(prev => ({ 
          ...prev, 
          televisors: mockData.televisors,
          selectedTelevisor: mockData.televisors[0],
          trainings: mockData.trainings,
          selectedTraining: mockData.trainings[0]
        }));
      }
      
      return gyms;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Ошибка загрузки залов' 
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Загрузка телевизоров для зала
  const loadTelevisors = useCallback(async (gymId) => {
    if (!gymId) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // ВРЕМЕННО: используем мок-данные
      const televisors = mockData.televisors.filter(t => t.gym_id === gymId);
      
      setState(prev => ({ 
        ...prev, 
        televisors,
        selectedTelevisor: televisors.length > 0 ? televisors[0] : null
      }));
      
      return televisors;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Ошибка загрузки телевизоров' 
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Загрузка тренировок
  const loadTrainings = useCallback(async (gymId, televisorId) => {
    console.log('⚠️ Backend has bug, using mock data');
    
    // Всегда возвращаем мок-данные пока бекенд не починят
    const mockTrainings = mockData.trainings;
    
    setState(prev => ({
      ...prev,
      trainings: mockTrainings,
      selectedTraining: mockTrainings[0],
      lastUpdate: new Date().toISOString()
    }));
    
    return mockTrainings;
  }, []);

  // Загрузка комнат
  const loadRooms = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Можно позже подключить реальный API
      const rooms = [];
      
      setState(prev => ({ ...prev, rooms }));
      return rooms;
    } catch (error) {
      console.error('Error loading rooms:', error);
      return [];
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

  // Выбор зала
  const selectGym = useCallback(async (gym) => {
    setState(prev => ({ 
      ...prev, 
      selectedGym: gym,
      televisors: mockData.televisors.filter(t => t.gym_id === gym.id),
      selectedTelevisor: mockData.televisors.find(t => t.gym_id === gym.id) || null,
      trainings: mockData.trainings,
      selectedTraining: mockData.trainings[0]
    }));
  }, []);

  // Выбор телевизора
  const selectTelevisor = useCallback(async (televisor) => {
    setState(prev => ({ 
      ...prev, 
      selectedTelevisor: televisor,
      trainings: mockData.trainings,
      selectedTraining: mockData.trainings[0]
    }));
  }, []);

  // Следующий раунд
  const nextRound = useCallback(() => {
    setState(prev => {
      const totalRounds = prev.selectedTraining?.totalRounds || 8;
      
      if (prev.currentRound < totalRounds) {
        return { ...prev, currentRound: prev.currentRound + 1 };
      }
      return prev;
    });
  }, []);

  // Предыдущий раунд
  const prevRound = useCallback(() => {
    setState(prev => {
      if (prev.currentRound > 1) {
        return { ...prev, currentRound: prev.currentRound - 1 };
      }
      return prev;
    });
  }, []);

  // Сброс раундов
  const resetRounds = useCallback(() => {
    setState(prev => ({ ...prev, currentRound: 1 }));
  }, []);

  // Обновление данных
  const refreshData = useCallback(async () => {
    console.log('🔄 Refreshing data...');
    setState(prev => ({ 
      ...prev, 
      lastUpdate: new Date().toISOString() 
    }));
  }, []);

  // ========== ЭФФЕКТЫ ==========

  // Инициализация при загрузке
  useEffect(() => {
    const initialize = async () => {
      await loadGyms();
      await loadRooms();
    };
    
    initialize();
  }, [loadGyms, loadRooms]);

  // ========== ПРЕДОСТАВЛЯЕМЫЕ ДАННЫЕ ==========

  const value = {
    // Данные
    ...state,
    
    // Функции загрузки
    loadGyms,
    loadTelevisors,
    loadTrainings,
    loadRooms,
    refreshData,
    
    // Функции выбора
    selectGym,
    selectTelevisor,
    
    // Функции раундов
    nextRound,
    prevRound,
    resetRounds,
    
    // Вспомогательные функции
    getCurrentTraining: () => state.selectedTraining,
    getTotalRounds: () => state.selectedTraining?.totalRounds || 8,
    getClientsForTraining: (trainingId) => {
      const training = state.trainings.find(t => t.id === trainingId);
      return training?.Clients || [];
    }
  };

  return (
    <TrainingContext.Provider value={value}>
      {children}
    </TrainingContext.Provider>
  );
};

// Экспорты
