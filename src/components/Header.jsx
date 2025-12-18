function Header({ title, subtitle, icon }) {
  return (
    <div className="header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
        {icon}
      </div>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: '2rem', opacity: 0.9 }}>{subtitle}</p>}
    </div>
  );
}

export default Header;