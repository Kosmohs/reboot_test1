/**
 * Утилиты для парсинга данных схемы тренировок (Scheme)
 */

/**
 * Получает список уникальных клиентов из Scheme
 */
export function getClientsFromScheme(scheme, options = {}) {
  const {
    trainingId = null,
    round = 1,
    uniqueOnly = true,
    sortBy = 'order'
  } = options;
  
  console.log('🔍 getClientsFromScheme ВХОД:', {
    schemeLength: scheme?.length,
    round,
    trainingId,
    uniqueOnly,
    sortBy
  });
  
  if (!scheme || !Array.isArray(scheme) || scheme.length === 0) {
    console.warn('❌ Scheme пустой или невалидный');
    return [];
  }
  
  const roundIndex = Math.max(0, Math.min(round - 1, scheme.length - 1));
  const currentRound = scheme[roundIndex];
  
  if (!currentRound || !Array.isArray(currentRound)) {
    console.warn(`❌ Раунд ${round} не найден в Scheme`);
    return [];
  }
  
  console.log(`📊 Раунд ${round} содержит ${currentRound.length} записей`);
  
  // Фильтрация по training_id если указан
  let filteredItems = currentRound;
  if (trainingId !== null) {
    filteredItems = currentRound.filter(item => item.training_id === trainingId);
    console.log(`🎯 После фильтрации по training_id=${trainingId}:`, filteredItems.length, 'записей');
  }
  
  // Собираем клиентов
  const clientMap = new Map();
  
  filteredItems.forEach((item, index) => {
    if (!item.client_id) return;
    
    const clientKey = uniqueOnly ? item.client_id : `${item.client_id}_${index}`;
    
    if (!clientMap.has(clientKey)) {
      clientMap.set(clientKey, {
        id: item.client_id,
        name: item.client_name || 'Клиент',
        station: item.station_number || '',
        station_id: item.station_id || null,
        training_id: item.training_id || null,
        training_name: item.training?.name || '',
        round: item.round || round,
        order: index,
        raw: item
      });
    }
  });
  
  let clients = Array.from(clientMap.values());
  
  // Сортировка
  switch (sortBy) {
    case 'station':
      clients.sort((a, b) => {
        const aMatch = (a.station || '').match(/(\d+)([A-Za-z]*)/);
        const bMatch = (b.station || '').match(/(\d+)([A-Za-z]*)/);
        
        const aNum = aMatch ? parseInt(aMatch[1]) : 0;
        const bNum = bMatch ? parseInt(bMatch[1]) : 0;
        const aLetter = aMatch ? aMatch[2] : '';
        const bLetter = bMatch ? bMatch[2] : '';
        
        if (aNum !== bNum) return aNum - bNum;
        return aLetter.localeCompare(bLetter);
      });
      break;
      
    case 'name':
      clients.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
      
    case 'order':
    default:
      // Уже в порядке массива
      break;
  }
  
  console.log(`✅ Получено клиентов:`, clients.length);
  clients.forEach((client, i) => {
    console.log(`   ${i}: ${client.name} - станция ${client.station}`);
  });
  
  return clients;
}

/**
 * Получает список всех training_id из Scheme
 */
export function getTrainingIdsFromScheme(scheme, round = 1) {
  if (!scheme || !Array.isArray(scheme)) return [];
  
  const roundIndex = Math.max(0, Math.min(round - 1, scheme.length - 1));
  const currentRound = scheme[roundIndex];
  
  if (!currentRound) return [];
  
  const trainingIds = new Set();
  currentRound.forEach(item => {
    if (item.training_id) {
      trainingIds.add(item.training_id);
    }
  });
  
  return Array.from(trainingIds);
}

/**
 * Получает программу по умолчанию для отображения
 */
export function getDefaultProgram(hitZoneData) {
  if (hitZoneData.allPrograms && hitZoneData.allPrograms.length > 0) {
    const program = hitZoneData.allPrograms[0];
    return {
      id: program.id,
      name: program.name,
      training_id: program.training_id || null,
      trainer: program.trainer
    };
  }
  
  if (hitZoneData.Scheme && hitZoneData.Scheme.length > 0) {
    const trainingIds = getTrainingIdsFromScheme(hitZoneData.Scheme, 1);
    
    if (trainingIds.length > 0) {
      const firstRound = hitZoneData.Scheme[0];
      const frequency = {};
      
      firstRound.forEach(item => {
        if (item.training_id) {
          frequency[item.training_id] = (frequency[item.training_id] || 0) + 1;
        }
      });
      
      const mostCommonId = Object.keys(frequency).reduce((a, b) => 
        frequency[a] > frequency[b] ? parseInt(a) : parseInt(b)
      );
      
      const trainingItem = firstRound.find(item => item.training_id === mostCommonId);
      
      return {
        id: `training_${mostCommonId}`,
        name: trainingItem?.training?.name || `Программа ${mostCommonId}`,
        training_id: mostCommonId
      };
    }
  }
  
  return {
    id: 'default',
    name: 'Программа',
    training_id: null
  };
}

/**
 * Получает информацию о тренировке
 */
export function getTrainingInfo(hitZoneData) {
    console.log('🔍 getTrainingInfo ВХОД:', {
    trainingInfo: hitZoneData.trainingInfo,
    hasTrainingInfo: !!hitZoneData.trainingInfo,
    trainingInfoKeys: hitZoneData.trainingInfo ? Object.keys(hitZoneData.trainingInfo) : []
  });

  const result = {
    name: hitZoneData.trainingInfo?.name || 'Тренировка',
    trainer: hitZoneData.trainingInfo?.trainer || 'Тренер',
    round: hitZoneData.trainingInfo?.round || 1,
    totalRounds: hitZoneData.trainingInfo?.totalRounds || 16,
    currentApproach: hitZoneData.trainingInfo?.currentApproach || 1,
    time: hitZoneData.trainingInfo?.time || '16:00'
  };
  
  console.log('🔍 getTrainingInfo ВЫХОД:', result);
  console.log('   round source:', hitZoneData.trainingInfo?.round, '→ using:', result.round);

  return {
    name: hitZoneData.trainingInfo?.name || 'Тренировка',
    trainer: hitZoneData.trainingInfo?.trainer || 'Тренер',
    round: hitZoneData.trainingInfo?.round || 1,
    totalRounds: hitZoneData.trainingInfo?.totalRounds || 16,
    currentApproach: hitZoneData.trainingInfo?.currentApproach || 1,
    time: hitZoneData.trainingInfo?.time || '16:00'
  };
}

/**
 * Получает данные для конкретной страницы
 */
export function getPageData(pageType, hitZoneData) {
  const baseInfo = getTrainingInfo(hitZoneData);
  const program = getDefaultProgram(hitZoneData);

  console.log('🔍 getPageData DEBUG:');
  console.log('- pageType:', pageType);
  console.log('- hitZoneData.trainingInfo:', hitZoneData.trainingInfo);
  console.log('- baseInfo.round:', baseInfo.round); // ← ЧТО ТУТ?
  console.log('- program.training_id:', program.training_id);

  
  let options = {};
  
  switch (pageType) {
    case 'page1_1':
      options = {
        trainingId: program.training_id,
        round: baseInfo.round,
        uniqueOnly: true,
        sortBy: 'order'
      };
      break;
      
    case 'page1_2':
      options = {
        trainingId: program.training_id,
        round: baseInfo.round,
        uniqueOnly: true,
        sortBy: 'station'
      };
      break;
      
    case 'page1_3':
      const trainingIds = getTrainingIdsFromScheme(hitZoneData.Scheme, 1);
      const programsData = trainingIds.slice(0, 2).map((trainingId, index) => {
        const clients = getClientsFromScheme(hitZoneData.Scheme, {
          trainingId,
          round: baseInfo.round,
          uniqueOnly: true,
          sortBy: 'order'
        });
        
        const firstItem = hitZoneData.Scheme[0]?.find(item => item.training_id === trainingId);
        
        return {
          id: `program_${index + 1}`,
          name: firstItem?.training?.name || `Программа ${index + 1}`,
          training_id: trainingId,
          clients: clients
        };
      });
      
      return {
        ...baseInfo,
        program,
        programs: programsData,
        pageType
      };
      
    case 'page1':
      const allTrainingIds = getTrainingIdsFromScheme(hitZoneData.Scheme, 1);
      const threePrograms = allTrainingIds.slice(0, 3).map((trainingId, index) => {
        const clients = getClientsFromScheme(hitZoneData.Scheme, {
          trainingId,
          round: baseInfo.round,
          uniqueOnly: true,
          sortBy: 'order'
        });
        
        const firstItem = hitZoneData.Scheme[0]?.find(item => item.training_id === trainingId);
        
        return {
          id: `program_${index + 1}`,
          name: firstItem?.training?.name || `Программа ${index + 1}`,
          training_id: trainingId,
          clients: clients
        };
      });
      
      return {
        ...baseInfo,
        program,
        programs: threePrograms,
        pageType
      };
      
    default:
      options = {
        trainingId: program.training_id,
        round: baseInfo.round,
        uniqueOnly: true,
        sortBy: 'order'
      };
  }
  
  const clients = getClientsFromScheme(hitZoneData.Scheme, options);
  
  return {
    ...baseInfo,
    program,
    clients,
    pageType
  };
}

/**
 * Анализирует Scheme и выводит детальную информацию
 */
export function analyzeScheme(scheme) {
  console.log('🔍 ===== АНАЛИЗ SCHEME =====');
  
  if (!scheme || !Array.isArray(scheme)) {
    console.log('❌ Scheme невалиден');
    return;
  }
  
  console.log(`📊 Всего раундов: ${scheme.length}`);
  
  scheme.forEach((round, roundIndex) => {
    console.log(`\n🎯 РАУНД ${roundIndex + 1} (индекс ${roundIndex}):`);
    console.log(`   Записей: ${round.length}`);
    
    // Выводим порядок в массиве
    console.log(`   🔢 ПОРЯДОК В МАССИВЕ (по индексу):`);
    round.forEach((item, idx) => {
      console.log(`      [${idx}] ${item.client_name} → станция ${item.station_number} (training_id: ${item.training_id})`);
    });
    
    // Группируем по client_id
    const clientsMap = new Map();
    
    round.forEach((item) => {
      const clientId = item.client_id || 'unknown';
      if (!clientsMap.has(clientId)) {
        clientsMap.set(clientId, []);
      }
      clientsMap.get(clientId).push(item.station_number);
    });
    
    // Выводим информацию по клиентам
    console.log(`   👤 КЛИЕНТЫ И ИХ СТАНЦИИ:`);
    clientsMap.forEach((stations, clientId) => {
      const clientName = round.find(item => item.client_id === clientId)?.client_name || 'Неизвестно';
      console.log(`      ${clientName}: ${stations.join(', ')}`);
    });
    
    // Статистика по станциям
    const stations = round.map(item => item.station_number).filter(Boolean);
    console.log(`   📍 Статистика станций:`);
    console.log(`      Всего: ${stations.length}`);
    console.log(`      Уникальных: ${new Set(stations).size}`);
    console.log(`      Список: ${stations.join(', ')}`);
  });
  
  console.log('🔍 ===== КОНЕЦ АНАЛИЗА =====\n');
}

// ... остальной код scheme-parser.js ...

/**
 * Получает станции по уникальным training_id в порядке появления
 */
/**
 * Получает станции по уникальным training_id из ВСЕХ раундов
 */
export function getStationsByUniqueTraining(scheme, options = {}) {
  const {
    maxTrainingIds = 8,
    trainingIdFilter = null,
    sortBy = 'appearance' // 'appearance' - порядок первого появления
  } = options;
  
  if (!scheme || !Array.isArray(scheme) || scheme.length === 0) {
    console.warn('❌ Scheme пустой');
    return [];
  }
  
  console.log(`📊 Всего раундов в Scheme: ${scheme.length}`);
  
  // Собираем уникальные training_id из ВСЕХ раундов
  const trainingMap = new Map();
  const uniqueTrainingIds = [];
  
  // Проходим по ВСЕМ раундам
  for (let roundIndex = 0; roundIndex < scheme.length; roundIndex++) {
    const round = scheme[roundIndex];
    if (!round || !Array.isArray(round)) continue;
    
    console.log(`  Раунд ${roundIndex + 1}: ${round.length} записей`);
    
    for (let itemIndex = 0; itemIndex < round.length; itemIndex++) {
      const item = round[itemIndex];
      if (!item.training_id) continue;
      
      // Если training_id еще не встречался
      if (!trainingMap.has(item.training_id)) {
        trainingMap.set(item.training_id, {
          training_id: item.training_id,
          training_name: item.training?.name || `Упр. ${item.training_id}`,
          clientId: item.client_id,
          clientName: item.client_name,
          station: item.station_number,
          station_id: item.station_id,
          round: item.round || (roundIndex + 1),
          roundIndex: roundIndex,
          itemIndex: itemIndex,
          appearanceOrder: uniqueTrainingIds.length, // Общий порядок появления
          raw: item
        });
        
        uniqueTrainingIds.push(item.training_id);
        
        console.log(`    ✅ Найден новый training_id ${item.training_id} в раунде ${roundIndex + 1}`);
      }
      
      // Останавливаемся когда набрали нужное количество
      if (uniqueTrainingIds.length >= maxTrainingIds) {
        console.log(`🎯 Достигнут лимит ${maxTrainingIds} уникальных training_id`);
        break;
      }
    }
    
    if (uniqueTrainingIds.length >= maxTrainingIds) break;
  }
  
  // Преобразуем в массив
  let stations = uniqueTrainingIds.map(trainingId => 
    trainingMap.get(trainingId)
  );
  
  // Фильтрация
  if (trainingIdFilter && Array.isArray(trainingIdFilter)) {
    stations = stations.filter(station => 
      trainingIdFilter.includes(station.training_id)
    );
  }
  
//   // Сортировка
//   if (sortBy === 'training_id') {
//     stations.sort((a, b) => a.training_id - b.training_id);
//   } else if (sortBy === 'station') {
//     stations.sort((a, b) => {
//       const aNum = parseInt(a.station) || 0;
//       const bNum = parseInt(b.station) || 0;
//       if (aNum !== bNum) return aNum - bNum;
//       return a.station.localeCompare(b.station);
//     });
//   }

    // Сортировка
    if (sortBy === 'training_id') {
    stations.sort((a, b) => a.training_id - b.training_id);
    } else if (sortBy === 'station') {
    stations.sort((a, b) => {
        const aNum = parseInt(a.station) || 0;
        const bNum = parseInt(b.station) || 0;
        if (aNum !== bNum) return aNum - bNum;
        return a.station.localeCompare(b.station);
    });
    } else if (sortBy === 'roundThenStation') {
    // Сначала по раунду первого появления, затем по станции
    stations.sort((a, b) => {
        if (a.round !== b.round) {
        return a.round - b.round; // Сначала по раунду
        }
        // Если в одном раунде - по станции
        const aNum = parseInt(a.station) || 0;
        const bNum = parseInt(b.station) || 0;
        if (aNum !== bNum) return aNum - bNum;
        return a.station.localeCompare(b.station);
    });
    }
  // 'appearance' - уже в порядке первого появления
  
  console.log(`\n✅ Всего найдено ${stations.length} уникальных training_id из ${scheme.length} раундов:`);
  stations.forEach((station, i) => {
    console.log(`   ${i}: training_id=${station.training_id} "${station.training_name}" → станция ${station.station} (найден в раунде ${station.round})`);
  });
  
  return stations;
}



/**
 * Анализирует все training_id во всех раундах
 */
export function analyzeAllTrainingIds(scheme) {
  if (!scheme || !Array.isArray(scheme)) return;
  
  console.log('🔍 === АНАЛИЗ ВСЕХ TRAINING_ID ===');
  console.log(`Всего раундов: ${scheme.length}`);
  
  const allTrainingIds = [];
  const trainingByRound = {};
  
  // Собираем данные
  scheme.forEach((round, roundIndex) => {
    if (!round || !Array.isArray(round)) return;
    
    const roundTrainingIds = round
      .map(item => item.training_id)
      .filter(Boolean);
    
    trainingByRound[roundIndex + 1] = {
      count: roundTrainingIds.length,
      trainingIds: roundTrainingIds,
      unique: [...new Set(roundTrainingIds)]
    };
    
    allTrainingIds.push(...roundTrainingIds);
  });
  
  // Анализ
  const uniqueTrainingIds = [...new Set(allTrainingIds)];
  
  console.log(`\n📊 СТАТИСТИКА:`);
  console.log(`Всего training_id во всех раундах: ${allTrainingIds.length}`);
  console.log(`Уникальных training_id: ${uniqueTrainingIds.length}`);
  console.log(`Уникальные ID: ${uniqueTrainingIds.sort((a, b) => a - b).join(', ')}`);
  
  console.log(`\n🎯 ПО РАУНДАМ:`);
  Object.entries(trainingByRound).forEach(([round, data]) => {
    console.log(`  Раунд ${round}: ${data.count} записей, ${data.unique.length} уникальных`);
    console.log(`    ID: ${data.trainingIds.join(', ')}`);
  });
  
  // Где каждый training_id встречается впервые
  console.log(`\n📍 ПЕРВОЕ ПОЯВЛЕНИЕ КАЖДОГО TRAINING_ID:`);
  const firstAppearance = {};
  
  scheme.forEach((round, roundIndex) => {
    round.forEach(item => {
      if (item.training_id && !firstAppearance[item.training_id]) {
        firstAppearance[item.training_id] = {
          round: roundIndex + 1,
          station: item.station_number,
          client: item.client_name
        };
      }
    });
  });
  
  Object.entries(firstAppearance)
    .sort(([aId], [bId]) => aId - bId)
    .forEach(([trainingId, data]) => {
      console.log(`  training_id ${trainingId}: впервые в раунде ${data.round}, станция ${data.station} (${data.client})`);
    });
  
  console.log('🔍 === КОНЕЦ АНАЛИЗА ===\n');
}


// Экспортируем ВСЕ функции
export default {
  getClientsFromScheme,
  getTrainingIdsFromScheme,
  getDefaultProgram,
  getTrainingInfo,
  getPageData,
  analyzeScheme,
  getStationsByUniqueTraining,
  analyzeAllTrainingIds,  // ← ДОБАВЬТЕ ЭТО!
};

