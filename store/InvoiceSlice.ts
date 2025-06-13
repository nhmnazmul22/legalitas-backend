import { InvoiceType } from "@/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/config/axios";

interface StateType {
  items: {
    status: string;
    data?: InvoiceType[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: StateType = {
  items: {
    status: "",
    data: [],
  },
  loading: false,
  error: null,
};

export const fetchInvoices = createAsyncThunk<InvoiceType[]>(
  "invoice/fetchInvoices",
  async () => {
    const response = await api.get<{
      status: string;
      data: InvoiceType[];
    }>(`/api/invoices`);
    return response.data.data;
  }
);

const InvoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchInvoices.fulfilled,
        (state, action: PayloadAction<InvoiceType[]>) => {
          state.loading = false;
          state.items.data = action.payload;
        }
      )
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export default InvoiceSlice.reducer;
