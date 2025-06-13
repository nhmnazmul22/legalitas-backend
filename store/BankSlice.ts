import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StateType = {
  banks: any[];
};

const initialState: StateType = {
  banks: [],
};

const bankSlice = createSlice({
  name: "addCurrentItems",
  initialState,
  reducers: {
    setBanks: (state, action: PayloadAction<any[]>) => {
      state.banks = action.payload;
    },
  },
});

export const { setBanks } = bankSlice.actions;

export default bankSlice.reducer;
