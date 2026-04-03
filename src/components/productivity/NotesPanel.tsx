import React, { useState } from 'react';
import useNotes, { Note } from '../../hooks/useNotes';
import { format } from 'date-fns';
import styles from './NotesPanel.module.css';

const NotesPanel: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteBody, setNoteBody] = useState<string>('');

  const handleNewNote = () => {
    const id = addNote('Untitled Note', '');
    const note = notes.find((n) => n.id === id);
    if (note) {
      setEditingNote(note);
      setNoteTitle('Untitled Note');
      setNoteBody('');
    } else {
      // In case state hasn't updated yet, mock it for editing
      setEditingNote({ id, title: 'Untitled Note', body: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      setNoteTitle('Untitled Note');
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
        <h2 className={styles.title}>NOTES</h2>
        <button className={styles.addBtn} onClick={handleNewNote}>
          + New Note
        </button>
      </div>

      {/* Notes Grid */}
      <div className={styles.notesGrid}>
        {notes.length === 0 ? (
          <p className={styles.emptyState}>No notes yet. Create one above!</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className={styles.noteCard} onClick={() => handleEditNote(note)}>
              <div className={styles.noteTitle}>{note.title || 'Untitled'}</div>
              <div className={styles.notePreview}>{note.body || 'Empty note'}</div>
              <div className={styles.noteDate}>
                {format(new Date(note.updatedAt), 'MMM d, yyyy')}
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
              placeholder="Note title..."
            />
            <textarea
              className={styles.bodyInput}
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder="Start writing..."
              autoFocus
            />
            <div className={styles.actions}>
              <button className={styles.saveBtn} onClick={handleSaveNote}>
                Save
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => {
                  deleteNote(editingNote.id);
                  setEditingNote(null);
                }}
              >
                Delete
              </button>
              <button className={styles.closeBtn} onClick={handleCloseEditor}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPanel;
