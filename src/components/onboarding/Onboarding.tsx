import React, { useState } from 'react';
import styles from './Onboarding.module.css';

interface OnboardingProps {
  onComplete: (name: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [isFading, setIsFading] = useState(false);

  const nextStep = () => {
    setIsFading(true);
    setTimeout(() => {
      setStep(prev => prev + 1);
      setIsFading(false);
    }, 800);
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className={styles.onboarding}>
      <div className={`${styles.content} ${isFading ? styles.fading : ''}`}>
        {step === 1 ? (
          <div className={styles.stepOne} onClick={nextStep}>
            <h1 className={styles.introText}>Ready to use time efficiently?</h1>
            <p className={styles.tapToContinue}>Click anywhere to begin</p>
          </div>
        ) : (
          <div className={styles.stepTwo}>
            <div className={styles.logoSection}>
              <h1 className={styles.logo}>KAIROS</h1>
              <div className={styles.definition}>
                <span className={styles.phonetic}>/ˈkīräs/</span>
                <span className={styles.dot}>•</span>
                <span className={styles.meaning}>the right, critical, or opportune moment.</span>
              </div>
            </div>

            <form onSubmit={handleFinish} className={styles.form}>
              <label className={styles.label}>What should we call you?</label>
              <input 
                autoFocus
                type="text" 
                className={styles.input} 
                placeholder="Your name..." 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className={styles.underline}></div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
