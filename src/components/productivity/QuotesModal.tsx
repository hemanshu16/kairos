import React, { useState } from 'react';
import { useQuotes } from '../../hooks/useQuotes';
import styles from './QuotesModal.module.css';

interface QuotesModalProps {
  onClose: () => void;
}

const QuotesModal: React.FC<QuotesModalProps> = ({ onClose }) => {
  const { quotes, loading, addQuote, deleteQuote, error } = useQuotes();
  const [newQuote, setNewQuote] = useState('');

  const handleAdd = async () => {
    if (!newQuote.trim()) return;
    await addQuote(newQuote);
    setNewQuote('');
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 2.5 1 4 3 6M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 2.5 1 4 3 6" />
            </svg>
            MY QUOTES
          </div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <div className={styles.addSection}>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter a new quote..."
            value={newQuote}
            onChange={(e) => setNewQuote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button className={styles.addBtn} onClick={handleAdd}>ADD</button>
        </div>

        <div className={styles.listContainer}>
          {loading ? (
            <div className={styles.loading}>Loading quotes...</div>
          ) : quotes.length === 0 ? (
            <div className={styles.empty}>No custom quotes yet. Defaults will be shown.</div>
          ) : (
            quotes.map((q) => (
              <div key={q.id} className={styles.quoteCard}>
                <div className={styles.quoteText}>"{q.text}"</div>
                <button className={styles.deleteBtn} onClick={() => deleteQuote(q.id)}>
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <path d="M18 6L6 18M6 6l12 12" />
                   </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotesModal;
