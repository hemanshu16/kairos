import React, { useState } from 'react';
import useNotes, { Note } from '../../hooks/useNotes';
import { format } from 'date-fns';
import styles from './NotesPanel.module.css';

const NotesPanel: React.FC = () => {
  const { notes, loading, addNote, updateNote, deleteNote } = useNotes();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteBody, setNoteBody] = useState<string>('');

  const handleNewNote = async () => {
    const id = await addNote('', ''); 
    if (id) {
      // The note might not be in the 'notes' array yet if we haven't refreshed
      // but 'addNote' adds it to the state locally in useNotes
      const newNote = { 
        id, 
        user_id: '', 
        title: '', 
        body: '', 
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString() 
      };
      setEditingNote(newNote);
      setNoteTitle('');
      setNoteBody('');
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteBody(note.body);
  };

  const handleSaveNote = () => {
    if (editingNote) {
      updateNote(editingNote.id, { title: noteTitle, body: noteBody });
      setEditingNote(null);
    }
  };

  const handleCloseEditor = () => {
    if (editingNote && !noteTitle.trim() && !noteBody.trim()) {
      deleteNote(editingNote.id);
    } else if (editingNote) {
      handleSaveNote();
    }
    setEditingNote(null);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.labelGroup}>
          <div className={styles.preTitle}>ZENITH • THOUGHTS</div>
          <div className={styles.title}>Your Notes</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* {loading && <div className={styles.loaderSmall}>Syncing...</div>} */}
          <button className={styles.addBtn} onClick={handleNewNote} disabled={loading}>
            + NEW NOTE
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className={styles.notesGrid}>
        {loading && notes.length === 0 ? (
          <div className={styles.loadingState}>
            <div className={styles.pulse}></div>
            <p>Loading your notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className={styles.emptyState}>NO NOTES YET</div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className={styles.noteCard} onClick={() => handleEditNote(note)}>
              <div className={styles.noteTitle}>{note.title || 'Untitled Note'}</div>
              <div className={styles.notePreview}>{note.body || 'Empty note...'}</div>
              <div className={styles.noteDate}>
                {format(new Date(note.updated_at), 'MMM d, h:mm a')}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Note Editor Modal */}
      {editingNote && (
        <div className={styles.modal} onClick={handleCloseEditor}>
          <div className={styles.editor} onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              className={styles.titleInput}
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note title"
              autoFocus={!noteTitle}
            />
            <textarea
              className={styles.bodyInput}
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder="Start writing your thoughts..."
              autoFocus={!!noteTitle}
            />
            <div className={styles.actions}>
              <button className={styles.saveBtn} onClick={handleSaveNote}>
                SAVE
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => {
                  deleteNote(editingNote.id);
                  setEditingNote(null);
                }}
              >
                DELETE
              </button>
              <button className={styles.closeBtn} onClick={handleCloseEditor}>
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default NotesPanel;
