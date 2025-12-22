function Page1() {
  const location = useLocation();
  
  console.log('⚡⚡⚡ PAGE1 RENDER ⚡⚡⚡');
  console.log('📍 location:', location);
  console.log('📍 location.pathname:', location.pathname);
  console.log('📍 location.state:', location.state);
  console.log('📍 typeof location.state:', typeof location.state);
  
  useEffect(() => {
    console.log('🔔 PAGE1 useEffect FIRED');
    console.log('📦 location.state in effect:', location.state);
  }, [location]); // Зависимость от location
  
  return (
    <div style={{ padding: '20px', fontSize: '24px' }}>
      <h1>Page1 Component</h1>
      <p>Path: {location.pathname}</p>
      <p>Has State: {location.state ? 'YES' : 'NO'}</p>
      <pre>{JSON.stringify(location.state, null, 2)}</pre>
    </div>
  );
}
export default Page1;