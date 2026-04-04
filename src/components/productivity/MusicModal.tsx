import React from 'react';
import { useMusic } from '../../hooks/useMusic';
import styles from './MusicModal.module.css';

interface MusicModalProps {
  onClose: () => void;
}

const MusicModal: React.FC<MusicModalProps> = ({ onClose }) => {
  const { 
    isPlaying, 
    currentTrack, 
    currentTrackIndex, 
    volume, 
    tracks, 
    playPause, 
    selectTrack, 
    nextTrack, 
    prevTrack, 
    setVolume 
  } = useMusic();

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            FOCUS MUSIC
          </div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.playerInfo}>
          <h2 className={styles.trackName}>{currentTrack.name}</h2>
          <p className={styles.mood}>{currentTrack.mood}</p>
        </div>

        <div className={styles.controls}>
          <button className={styles.skipBtn} onClick={prevTrack}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18V6h2v12H6zm3.5-6L18 18V6l-8.5 6z" />
            </svg>
          </button>
          
          <button className={styles.playBtn} onClick={playPause}>
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button className={styles.skipBtn} onClick={nextTrack}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 18h2V6h-2v12zM6 6v12l8.5-6L6 6z" />
            </svg>
          </button>
        </div>

        <div className={styles.volumeSection}>
          <div className={styles.volumeIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            </svg>
            <span>Volume</span>
          </div>
          <input 
            type="range" 
            className={styles.range} 
            value={volume} 
            onChange={(e) => setVolume(parseInt(e.target.value))}
          />
        </div>

        <div className={styles.trackList}>
          {tracks.map((track, index) => (
            <div 
              key={index} 
              className={`${styles.trackItem} ${currentTrackIndex === index ? styles.active : ''}`}
              onClick={() => selectTrack(index)}
            >
              <span className={styles.itemTitle}>{track.name}</span>
              <span className={styles.itemMood}>{track.mood}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicModal;
