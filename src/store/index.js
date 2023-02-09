import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth";
import searchSlice from "./search";
import tagSlice from "./tag_filter";
import filterSlice from "./filter";
import commentSlice from './articles'
import myFilterSlice from "./myfilters";
import notesSlice from "./notes";
const store = configureStore({
  reducer: {
    search: searchSlice.reducer,
    tag: tagSlice.reducer,
    auth: authSlice.reducer,
    filter: filterSlice.reducer,
    comment: commentSlice.reducer,
    myFilter: myFilterSlice.reducer,
    notes: notesSlice.reducer,
  },
});

export const searchActions = searchSlice.actions;
export const tagActions = tagSlice.actions;
export const authActions = authSlice.actions;
export const filterActions = filterSlice.actions;
export const commentActions = commentSlice.actions;
export const myFilterActions = myFilterSlice.actions;
export const notesActions = notesSlice.actions;

export default store;
