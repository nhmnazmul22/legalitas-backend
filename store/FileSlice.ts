import { FileType } from "@/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/config/axios";

interface StateType {
  items: {
    status?: string;
    data: FileType[];
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

export const fetchFiles = createAsyncThunk<FileType[]>(
  "files/fetchFiles",
  async () => {
    const response = await api.get<{
      status: string;
      data: FileType[];
    }>(`/api/file`);
    return response.data.data;
  }
);

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFiles.fulfilled,
        (state, action: PayloadAction<FileType[]>) => {
          state.loading = false;
          state.items.data = action.payload;
        }
      )
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export default fileSlice.reducer;
