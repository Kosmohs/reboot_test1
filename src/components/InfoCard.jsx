function InfoCard({ title, items, color = '#fff' }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      padding: '2rem',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      maxWidth: '600px',
      margin: '1rem'
    }}>
      <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color }}>{title}</h3>
      <div style={{ fontSize: '1.8rem', textAlign: 'left' }}>
        {items.map((item, index) => (
          <p key={index} style={{ marginBottom: '0.8rem' }}>• {item}</p>
        ))}
      </div>
    </div>
  );
}

export default InfoCard;