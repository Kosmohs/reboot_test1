function Schedule({ events }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.3)',
      padding: '2rem',
      borderRadius: '15px',
      marginTop: '2rem'
    }}>
      <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>📅 Расписание</h3>
      <div style={{ fontSize: '1.8rem' }}>
        {events.map((event, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '1rem',
            padding: '1rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '10px'
          }}>
            <span>{event.time}</span>
            <span style={{ fontWeight: 'bold' }}>{event.name}</span>
            <span>{event.trainer}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Schedule;