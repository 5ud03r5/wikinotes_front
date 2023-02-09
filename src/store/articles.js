import { createSlice } from "@reduxjs/toolkit";
const initialCommentState = { counter: 0, comments: [] };
const commentSlice = createSlice({
  name: "comment",
  initialState: initialCommentState,
  reducers: {
    commentReducer(state, action) {
      console.log(action.payload)
      state.comments = action.payload;
    },
  },
});

export default commentSlice;
