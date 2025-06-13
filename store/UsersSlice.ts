import { UserType } from "@/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/config/axios";

interface UsersState {
  items: {
    status: string;
    message?: string;
    data?: UserType[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: {
    status: "",
    message: "",
    data: [],
  },
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk<UserType[]>(
  "users/fetchUser",
  async () => {
    const response = await api.get<{
      status: string;
      message?: string;
      data: UserType[];
    }>(`/api/users/get-user`);
    return response.data.data;
  }
);

const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<UserType[]>) => {
          state.loading = false;
          state.items.data = action.payload;
        }
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export default usersSlice.reducer;
