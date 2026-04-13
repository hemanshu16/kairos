import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useNotes, { Note } from '../../hooks/useNotes';
import { format } from 'date-fns';
import styles from './NotesPanel.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0, y: 20 },
  visible: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 22 } },
  hover: { y: -6, scale: 1.02, boxShadow: '0 15px 45px rgba(245,166,35,0.2)', borderColor: '#f5a623', transition: { duration: 0.2 } },
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.15 } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }
};

const NotesPanel: React.FC = () => {
  const { notes, loading, addNote, updateNote, deleteNote } = useNotes();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingNote) {
      const timer = setTimeout(() => {
        setIsSaving(true);
        updateNote(editingNote.id, { title: noteTitle, body: noteBody });
        setTimeout(() => setIsSaving(false), 800);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [noteTitle, noteBody]);

  const handleNewNote = async () => {
    const id = await addNote('', ''); 
    if (id) {
      setEditingNote({ 
        id, user_id: '', title: '', body: '', 
        created_at: new Date().toISOString(), updated_at: new Date().toISOString() 
      });
      setNoteTitle('');
      setNoteBody('');
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteBody(note.body);
  };

  const handleCloseEditor = () => {
    if (editingNote && !noteTitle.trim() && !noteBody.trim()) {
      deleteNote(editingNote.id);
    }
    setEditingNote(null);
  };

  return (
    <motion.div className={styles.panel} initial="hidden" animate="visible" variants={containerVariants}>
      
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.labelGroup}>
          <div className={styles.preTitle}>ZENITH • THOUGHTS</div>
          <div className={styles.title}>Your Notes</div>
        </div>
        <motion.button 
          className={styles.addBtn} 
          onClick={handleNewNote} 
          disabled={loading}
          whileHover={{ scale: 1.05, y: -2, filter: 'brightness(1.1)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'linear-gradient(135deg, #f5a623, #ffc857, #fff)',
            boxShadow: '0 8px 25px rgba(245,166,35,0.4)',
            color: '#000'
          }}
        >
          + NEW NOTE
        </motion.button>
      </div>

      {/* ── Grid ── */}
      <motion.div className={styles.notesGrid} layout>
        {loading && notes.length === 0 ? (
          <div className={styles.loadingState}>
            <div className={styles.pulse} />
            <p>Loading your thoughts...</p>
          </div>
        ) : notes.length === 0 ? (
          <motion.div className={styles.emptyState} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            No notes yet. Create one to start storing your thoughts.
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {notes.map(note => (
              <motion.div 
                key={note.id} 
                className={styles.noteCard} 
                onClick={() => handleEditNote(note)}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                exit="exit"
                layout
              >
                <div className={styles.noteTitle} style={{ color: '#fff' }}>
                  {note.title || 'Untitled Note'}
                </div>
                <div className={styles.notePreview} style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {note.body || 'Empty note...'}
                </div>
                <div className={styles.noteFooter}>
                  <div className={styles.noteDate} style={{ color: '#f5a623' }}>
                    {format(new Date(note.updated_at), 'MMM d, h:mm a')}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      {/* ── Editor Modal ── */}
      <AnimatePresence>
        {editingNote && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(25px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            onClick={handleCloseEditor}
          >
            <motion.div 
              className={styles.editorContainer}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.editorHeader}>
                <motion.div 
                  className={styles.savingIndicator}
                  animate={{ opacity: isSaving ? 1 : 0.6, color: isSaving ? '#fff' : '#ffb400' }}
                >
                  {isSaving ? 'Saving...' : 'All changes saved'}
                </motion.div>
                <motion.button 
                  className={styles.closeEditorBtn}
                  onClick={handleCloseEditor}
                  whileHover={{ rotate: 90, color: '#ff4757', scale: 1.2 }}
                >
                  ×
                </motion.button>
              </div>
              
              <input
                type="text"
                className={styles.titleInput}
                value={noteTitle}
                onChange={e => setNoteTitle(e.target.value)}
                placeholder="Note title"
                autoFocus={!noteTitle}
                style={{ color: '#fff' }}
              />
              <textarea
                className={styles.bodyInput}
                value={noteBody}
                onChange={e => setNoteBody(e.target.value)}
                placeholder="Start writing..."
                autoFocus={!!noteTitle}
                style={{ color: '#fff' }}
              />
              
              <div className={styles.editorFooter}>
                <div className={styles.footerDate}>
                   Last edited {format(new Date(editingNote.updated_at), 'MMMM do, yyyy')}
                </div>
                <div className={styles.editorActions}>
                   <motion.button 
                     className={styles.deleteBtn}
                     onClick={() => { deleteNote(editingNote.id); setEditingNote(null); }}
                     whileHover={{ scale: 1.05, background: '#ff4757', color: '#fff' }}
                     whileTap={{ scale: 0.95 }}
                   >
                     DELETE
                   </motion.button>
                   <motion.button 
                     className={styles.saveBtn} 
                     onClick={handleCloseEditor}
                     whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                     whileTap={{ scale: 0.95 }}
                     style={{ background: 'linear-gradient(135deg, #f5a623, #ff9f43)', color: '#000' }}
                   >
                     DONE
                   </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NotesPanel;
