import { createSlice } from "@reduxjs/toolkit";

const initialTagState = { tag: "" };

const tagSlice = createSlice({
  name: "tag",
  initialState: initialTagState,
  reducers: {
    tagReducer(state, action) {
      state.tag = action.payload;
    },
  },
});

export default tagSlice;
