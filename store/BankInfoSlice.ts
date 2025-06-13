import { BankInfo } from "@/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/config/axios";

interface UsersState {
  items: {
    status: string;
    data?: BankInfo[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: {
    status: "",
    data: [],
  },
  loading: false,
  error: null,
};

export const fetchBanks = createAsyncThunk<BankInfo[]>(
  "banks/fetchBanks",
  async () => {
    const response = await api.get<{
      status: string;
      data: BankInfo[];
    }>(`/api/bank`);
    return response.data.data;
  }
);

const BanksSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBanks.fulfilled,
        (state, action: PayloadAction<BankInfo[]>) => {
          state.loading = false;
          if (
            JSON.stringify(state.items.data) !== JSON.stringify(action.payload)
          ) {
            state.items.data = action.payload;
          }
        }
      )
      .addCase(fetchBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export default BanksSlice.reducer;
