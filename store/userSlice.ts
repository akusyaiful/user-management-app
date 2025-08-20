import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface User {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image?: string;
  isNew?: boolean;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  total: number;
  skip: number;
  limit: number;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  total: 0,
  skip: 0,
  limit: 10,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ limit, skip }: { limit: number; skip: number }) => {
    const res = await axios.get(
      `https://dummyjson.com/users?limit=${limit}&skip=${skip}`
    );
    return res.data;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.unshift({ ...action.payload, isNew: true });
    },
    editUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );
      if (index >= 0) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

export const { addUser, editUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
