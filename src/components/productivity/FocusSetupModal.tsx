import React, { useState } from 'react';
import styles from './FocusSetupModal.module.css';

const PROMPT_OPTIONS = [0, 5, 10, 15, 20, 30]; // 0 means 'Off'

interface FocusSetupModalProps {
  onClose: () => void;
  onStart: (durationMinutes: number, promptMinutes: number, task: string) => void;
}

const FocusSetupModal: React.FC<FocusSetupModalProps> = ({ onClose, onStart }) => {
  const [task, setTask] = useState('');
  const [promptMinutes, setPromptMinutes] = useState(15);
  const [customPrompt, setCustomPrompt] = useState('15');
  const [customDuration, setCustomDuration] = useState('');

  const handleStartSession = () => {
    const finalDuration = parseInt(customDuration, 10);
    if (!isNaN(finalDuration) && finalDuration > 0) {
      console.log("Starting session:", { finalDuration, promptMinutes, task });
      onStart(finalDuration, promptMinutes, task);
    } else {
      alert("Please enter a valid duration in minutes.");
    }
  };

  const setPrompt = (val: number) => {
    setPromptMinutes(val);
    setCustomPrompt(val === 0 ? '' : val.toString());
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>NEW FOCUS TIMER</div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <input
          type="text"
          className={styles.taskInput}
          placeholder="What will you focus on?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <div className={styles.sectionTitle}>LOG PROMPTS</div>
        
        <div className={styles.promptsRow}>
          {PROMPT_OPTIONS.map((opt) => (
            <button
              key={opt}
              className={`${styles.promptChip} ${promptMinutes === opt ? styles.active : ''}`}
              onClick={() => setPrompt(opt)}
            >
              {opt === 0 ? 'Off' : `${opt}m`}
            </button>
          ))}
        </div>

        <div className={styles.customPromptRow}>
          Custom every
          <input
            type="number"
            className={styles.customPromptInput}
            value={customPrompt}
            onChange={(e) => {
              setCustomPrompt(e.target.value);
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val) && val > 0) {
                setPromptMinutes(val);
              }
            }}
          />
          min
        </div>

        <div className={styles.sectionTitle}>SESSION DURATION (MIN)</div>

        <div className={styles.customActionRow}>
          <input 
            type="number" 
            placeholder="Custom (min)" 
            className={styles.customInputBtn}
            value={customDuration}
            onChange={(e) => setCustomDuration(e.target.value)}
          />
          <button className={styles.goBtn} onClick={handleStartSession}>Go</button>
        </div>

        <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default FocusSetupModal;
