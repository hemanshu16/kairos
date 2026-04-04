import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { MusicProvider } from './contexts/MusicContext';
import { BellProvider } from './contexts/BellContext';
import Dashboard from './components/layout/Dashboard';
import AuthScreen from './components/auth/AuthScreen';
import Onboarding from './components/onboarding/Onboarding';
import './styles/global.css';

const ONBOARDED_KEY = 'kairos_onboarded';

function App() {
  const { user, loading } = useAuth();
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => {
    return localStorage.getItem(ONBOARDED_KEY) === 'true';
  });
  const [hasInteracted, setHasInteracted] = useState(false);

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

  // Phase 1: Onboarding
  if (!hasOnboarded) {
    return (
      <Onboarding onComplete={(name) => {
        localStorage.setItem('kairos_username', name);
        localStorage.setItem(ONBOARDED_KEY, 'true');
        setHasOnboarded(true);
      }} />
    );
  }

  // Phase 2: Dashboard with deferred Auth
  const shouldShowAuth = !user && hasInteracted;

  if (shouldShowAuth) {
    return (
      <AuthScreen />
    );
  }

  return (
    <div 
      onClick={() => {
        if (!user && !hasInteracted) {
          setHasInteracted(true);
        }
      }}
      style={{ width: '100%', height: '100vh', display: 'flex' }}
    >
      <AppProvider>
        <BellProvider>
          <MusicProvider>
            <Dashboard />
          </MusicProvider>
        </BellProvider>
      </AppProvider>
    </div>
  );
}

export default App;
