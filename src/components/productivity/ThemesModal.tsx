import React, { useState, useRef } from 'react';
import { useThemes } from '../../hooks/useThemes';
import { useApp } from '../../contexts/AppContext';
import styles from './ThemesModal.module.css';

interface ThemesModalProps {
  onClose: () => void;
}

const ThemesModal: React.FC<ThemesModalProps> = ({ onClose }) => {
  const { themes, loading, uploading, uploadAndAddTheme, deleteTheme, applyTheme, error } = useThemes();
  const { customBg } = useApp();
  const [themeName, setThemeName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadAndAddTheme(file, themeName || file.name);
      setThemeName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            MY THEMES
          </div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <div className={styles.uploadSection}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="Theme name (optional)"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              disabled={uploading}
            />
            <button 
              className={styles.uploadBtn} 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'UPLOADING...' : 'UPLOAD IMAGE'}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleUpload}
            />
          </div>
          <p className={styles.hint}>Upload a high-resolution image for the best experience.</p>
        </div>

        <div className={styles.listContainer}>
          <div 
            className={`${styles.themeCard} ${!customBg ? styles.active : ''}`}
            onClick={() => applyTheme(null)}
          >
            <div className={styles.previewDefault}>
              <div className={styles.skyGradient}></div>
            </div>
            <div className={styles.themeInfo}>
              <div className={styles.themeName}>Dynamic Sky</div>
              <div className={styles.themeStatus}>DEFAULT CYCLE</div>
            </div>
          </div>

          {loading ? (
            <div className={styles.loading}>Loading your themes...</div>
          ) : (
            themes.map((t) => (
              <div 
                key={t.id} 
                className={`${styles.themeCard} ${customBg === t.url ? styles.active : ''}`}
                onClick={() => applyTheme(t.url)}
              >
                <div className={styles.previewImage}>
                  <img src={t.url} alt={t.name} />
                </div>
                <div className={styles.themeInfo}>
                  <div className={styles.themeName}>{t.name}</div>
                  <button 
                    className={styles.deleteBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTheme(t.id, t.url);
                    }}
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemesModal;
