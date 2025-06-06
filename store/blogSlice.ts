import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BlogType } from "@/types";

type StateType = {
  items: {
    status?: string;
    message?: string;
    data: BlogType;
  };
  loading: boolean;
  error: string | null;
};

// Initial state
const initialState: StateType = {
  items: {
    status: "",
    message: "",
    data: {},
  },
  loading: false,
  error: null,
};

// ✅ Async thunk to fetch blog by ID
export const fetchBlogById = createAsyncThunk(
  "artikel/fetchBlogById",
  async (id: string, thunkAPI) => {
    try {
      const res = await fetch(`/api/artikel/${id}`);

      if (!res.ok) {
        const error = await res.json();
        return thunkAPI.rejectWithValue(error.error || "Failed to fetch blog");
      }

      const data = await res.json();
      return data.data as BlogType;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Network error");
    }
  }
);

const BlogSlice = createSlice({
  name: "artikel",
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
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBlogById.fulfilled,
        (state, action: PayloadAction<BlogType>) => {
          state.loading = false;
          state.items.data = action.payload;
        }
      )
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBlog } = BlogSlice.actions;
export default BlogSlice.reducer;
