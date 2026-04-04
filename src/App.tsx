import { useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { MusicProvider } from './contexts/MusicContext';
import { BellProvider } from './contexts/BellContext';
import Dashboard from './components/layout/Dashboard';
import AuthScreen from './components/auth/AuthScreen';
import './styles/global.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#05060f',
        color: '#f5a623',
        fontFamily: 'Space Mono, monospace',
        letterSpacing: '4px'
      }}>
        LOADING...
      </div>
    );
  }

  return (
    <>
      {!user && <AuthScreen />}
      {user && (
        <AppProvider>
          <BellProvider>
            <MusicProvider>
              <Dashboard />
            </MusicProvider>
          </BellProvider>
        </AppProvider>
      )}
    </>
  );
}

export default App;
