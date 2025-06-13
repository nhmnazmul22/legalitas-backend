import { UserType } from "@/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/config/axios";

interface UsersState {
  items: {
    status: string;
    data?: UserType;
  };
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: {
    status: "",
    data: {},
  },
  loading: false,
  error: null,
};

export const fetchUser = createAsyncThunk<UserType, string>(
  "users/fetchUserById",
  async (id: string) => {
    const response = await api.get<{
      status: string;
      data: UserType;
    }>(`/api/users/get-user/${id}`);
    return response.data.data;
  }
);

const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<UserType>) => {
          state.loading = false;
          if (
            JSON.stringify(state.items.data) !== JSON.stringify(action.payload)
          ) {
            state.items.data = action.payload;
          }
        }
      )
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export default usersSlice.reducer;
