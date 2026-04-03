import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/react';
import './index.css';
import App from './App';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key. Add VITE_CLERK_PUBLISHABLE_KEY to your .env file.');
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: '#f5a623',
          colorBackground: 'rgba(17, 19, 30, 0.95)',
          colorText: '#e8e0d0',
          colorTextSecondary: 'rgba(232, 224, 208, 0.5)',
          colorInputBackground: 'rgba(255, 255, 255, 0.06)',
          colorInputText: '#e8e0d0',
          borderRadius: '12px',
          fontFamily: "'DM Sans', sans-serif",
        },
        elements: {
          // Card container
          card: {
            backgroundColor: 'rgba(17, 19, 30, 0.95)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(245, 166, 35, 0.15)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)',
          },
          // Form fields
          formFieldInput: {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderColor: 'rgba(245, 166, 35, 0.15)',
            color: '#e8e0d0',
          },
          'formFieldInput:focus': {
            borderColor: '#f5a623',
            boxShadow: '0 0 0 2px rgba(245, 166, 35, 0.2)',
          },
          // Primary button
          formButtonPrimary: {
            background: 'linear-gradient(135deg, #ffc857, #f5a623)',
            color: '#111',
            fontWeight: '700',
          },
          'formButtonPrimary:hover': {
            background: 'linear-gradient(135deg, #f5a623, #e89500)',
          },
          // Links
          footerActionLink: {
            color: '#f5a623',
          },
          // Header
          headerTitle: {
            fontFamily: "'Space Mono', monospace",
            color: '#f5a623',
          },
          headerSubtitle: {
            color: 'rgba(232, 224, 208, 0.5)',
          },
          // Social buttons
          socialButtonsBlockButton: {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderColor: 'rgba(245, 166, 35, 0.15)',
            color: '#e8e0d0',
          },
          'socialButtonsBlockButton:hover': {
            backgroundColor: 'rgba(245, 166, 35, 0.1)',
          },
          // User button
          userButtonAvatarBox: {
            width: '36px',
            height: '36px',
          },
          // Divider
          dividerLine: {
            backgroundColor: 'rgba(245, 166, 35, 0.15)',
          },
          dividerText: {
            color: 'rgba(232, 224, 208, 0.5)',
          },
        },
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
);
