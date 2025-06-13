import { ProposalType } from "@/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/config/axios";

interface StateType {
  items: {
    status: string;
    data?: ProposalType;
  };
  loading: boolean;
  error: string | null;
}

const initialState: StateType = {
  items: {
    status: "",
    data: {},
  },
  loading: false,
  error: null,
};

export const fetchProposalById = createAsyncThunk<ProposalType, string>(
  "proposal/fetchProposalById",
  async (id: string) => {
    const response = await api.get<{
      status: string;
      data: ProposalType;
    }>(`/api/proposals/${id}`);
    return response.data.data;
  }
);

const proposalSlice = createSlice({
  name: "proposal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProposalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProposalById.fulfilled,
        (state, action: PayloadAction<ProposalType>) => {
          state.loading = false;
          if (
            JSON.stringify(state.items.data) !== JSON.stringify(action.payload)
          ) {
            state.items.data = action.payload;
          }
        }
      )
      .addCase(fetchProposalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export default proposalSlice.reducer;
