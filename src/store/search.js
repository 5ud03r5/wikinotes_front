import { createSlice } from "@reduxjs/toolkit";
const initialSearchState = { search: "" };
const searchSlice = createSlice({
  name: "search",
  initialState: initialSearchState,
  reducers: {
    searchReducer(state, action) {
      state.search = action.payload;
    },
  },
});

export default searchSlice;