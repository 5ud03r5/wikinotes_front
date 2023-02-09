import { createSlice } from "@reduxjs/toolkit";
const initialMyFilterState = { myFilter: false };
const myFilterSlice = createSlice({
  name: "myFilter",
  initialState: initialMyFilterState,
  reducers: {
    myFilterAddReducer(state, action) {
      return {
        myFilter: true,
      };
    },

    myFilterRemoveReducer(state, action) {
      return {
        myFilter: false,
      };
    },
  },
});

export default myFilterSlice;
