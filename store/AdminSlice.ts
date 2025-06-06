import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AdminType } from "@/types";

type StateType = {
  items: {
    status?: string;
    data: AdminType;
  };
  loading: boolean;
  error: string | null;
};

// Initial state
const initialState: StateType = {
  items: {
    status: "",
    data: {},
  },
  loading: false,
  error: null,
};

// ✅ Async thunk to fetch blog by ID
export const fetchAdminByEmail = createAsyncThunk(
  "admin/fetchAdminByEmail",
  async (email: string, thunkAPI) => {
    try {
      const res = await fetch(`/api/author/${email}`);

      if (!res.ok) {
        const error = await res.json();
        return thunkAPI.rejectWithValue(error.error || "Failed to fetch blog");
      }

      const data = await res.json();
      return data.data as AdminType;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Network error");
    }
  }
);

const AdminSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearBlog: (state) => {
      state.items.data = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminByEmail.fulfilled,
        (state, action: PayloadAction<AdminType>) => {
          state.loading = false;
          state.items.data = action.payload;
        }
      )
      .addCase(fetchAdminByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBlog } = AdminSlice.actions;
export default AdminSlice.reducer;
