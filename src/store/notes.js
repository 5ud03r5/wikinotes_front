import { createSlice } from "@reduxjs/toolkit";
const initialNotesState = { notes: [] };
const notesSlice = createSlice({
  name: "notes",
  initialState: initialNotesState,
  reducers: {
    notesReducer(state, action) {
      state.notes = action.payload;
    },
    notesAddReducer(state, action) {
      return {
        notes: [...state.notes, action.payload],
      };
    },
    notesUpdateReducer(state, action) {
      const updatedNotes = state.notes.map((note) => {
        if (note.id === action.payload.id) {
          return { ...note, ...action.payload };
        }
        return note;
      });
      state.notes = updatedNotes;
    },
    notesDeleteReducer(state, action) {
        console.log(action.payload)
        state.notes = state.notes.filter((note) => note.id !== action.payload)
    }
  },
});

export default notesSlice;
