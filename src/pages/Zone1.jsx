import Header from '../components/Header';
import InfoCard from '../components/InfoCard';
import Schedule from '../components/Schedule';

function Zone1() {
  const equipment = [
    'Тренажеры для грудных мышц',
    'Тренажеры для спины', 
    'Свободные веса',
    'Стойки для приседаний',
    'Силовые рамы',
    'Гантели 5-50 кг'
  ];

  const schedule = [
    { time: '09:00-10:00', name: 'Functional Training', trainer: 'Анна' },
    { time: '11:00-12:00', name: 'Power Lifting', trainer: 'Михаил' },
    { time: '14:00-15:00', name: 'Chest & Back', trainer: 'Денис' },
    { time: '17:00-18:00', name: 'Legs Day', trainer: 'Ольга' }
  ];

  return (
    <div className="page zone-1">
      <Header 
        icon="💪" 
        title="Зона 1" 
        subtitle="Силовые тренажеры и свободные веса" 
      />
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <InfoCard 
          title="Оборудование" 
          items={equipment}
          color="#ffd93d"
        />
        
        <div>
          <InfoCard 
            title="Правила" 
            items={[
              'Используйте полотенце',
              'Убирайте веса после использования',
              'Ограничение: 30 мин на тренажер в час пик'
            ]}
            color="#4ecdc4"
          />
        </div>
      </div>

      <Schedule events={schedule} />
    </div>
  );
}

export default Zone1;