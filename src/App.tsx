import { useAuth } from '@clerk/react';
import { AppProvider } from './contexts/AppContext';
import Dashboard from './components/layout/Dashboard';
import AuthScreen from './components/auth/AuthScreen';
import './styles/global.css';

function App() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return (
    <>
      {!isSignedIn && <AuthScreen />}
      {isSignedIn && (
        <AppProvider>
          <Dashboard />
        </AppProvider>
      )}
    </>
  );
}

export default App;
