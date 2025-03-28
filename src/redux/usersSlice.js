import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ page, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://reqres.in/api/users?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Since reqres.in doesn't actually delete users, return the userId
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete user");
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, updatedData, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `https://reqres.in/api/users/${id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { id, updatedData: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update user");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    totalPages: 1,
    page: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.totalPages = action.payload.total_pages;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = state.data.filter((user) => user.id !== action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = state.data.map((user) =>
          user.id === action.payload.id
            ? { ...user, ...action.payload.updatedData }
            : user
        );
      });
  },
});

export const { setPage } = usersSlice.actions;
export default usersSlice.reducer;
