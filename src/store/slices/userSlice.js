import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../lib/axiosClient";

// ✅ API CALL
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (id, thunkAPI) => {
    try {
      const response = await axiosClient.get(`/users/${id}`);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    clearUser: (state) => {
      state.user = null;
    },
  },

  // ✅ Async states
  extraReducers: (builder) => {
    builder

      // Pending
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Success
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      // Failed
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;