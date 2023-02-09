import { createSlice } from "@reduxjs/toolkit";
const initialFilterState = { filter: [], filtered: [] };
const filterSlice = createSlice({
  name: "filter",
  initialState: initialFilterState,
  reducers: {
    reset: () => initialFilterState,
    filterReducerNew(state, action) {
      console.log(action.payload);
      state.filter = action.payload;
    },
    filterReducer(state, action) {
      return {
        filter: [...state.filter, action.payload],
      };
    },
    filteredReducer(state, action) {
      state.filtered = action.payload;
    },
  },
});

export default filterSlice;
