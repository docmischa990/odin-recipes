// notesManager.js
import { localStorageUtils } from './localStorageUtils.js';

const notesManager = (() => {
  const NOTES_KEY = 'notes'; // Key for storing notes in localStorage

  /**
   * Fetch all notes from local storage.
   * @returns {Array} - Array of note objects.
   */
  const getNotes = () => {
    const notes = localStorageUtils.getFromLocalStorage(NOTES_KEY);
    return notes || []; // Return an empty array if no notes are found
  };

  /**
   * Save a list of notes to local storage.
   * @param {Array} notes - Array of note objects to save.
   */
  const saveNotes = notes => {
    localStorageUtils.saveToLocalStorage(NOTES_KEY, notes);
  };

  /**
   * Add a new note.
   * @param {string} title - Title of the note.
   * @param {string} content - Content of the note.
   */
  const addNote = (title, content) => {
    const notes = getNotes();
    const newNote = {
      id: Date.now(), // Unique ID based on timestamp
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(), // Timestamp for creation
    };
    notes.push(newNote);
    saveNotes(notes);
  };

  /**
   * Update an existing note by ID.
   * @param {number} id - ID of the note to update.
   * @param {Object} updates - Object containing updated fields (title, content).
   */
  const updateNote = (id, updates) => {
    const notes = getNotes();
    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex !== -1) {
      const updatedNote = { ...notes[noteIndex], ...updates, updatedAt: new Date().toISOString() };
      notes[noteIndex] = updatedNote;
      saveNotes(notes);
    } else {
      console.error(`Note with ID ${id} not found.`);
    }
  };

  /**
   * Delete a note by ID.
   * @param {number} id - ID of the note to delete.
   */
  const deleteNote = id => {
    const notes = getNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    saveNotes(filteredNotes);
  };

  /**
   * Get a specific note by ID.
   * @param {number} id - ID of the note to retrieve.
   * @returns {Object|null} - The note object or null if not found.
   */
  const getNoteById = id => {
    const notes = getNotes();
    return notes.find(note => note.id === id) || null;
  };

  return {
    getNotes,
    addNote,
    updateNote,
    deleteNote,
    getNoteById,
  };
})();

export { notesManager };
