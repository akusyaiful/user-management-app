import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from ".";

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image?: string;
  isNew?: boolean;
}

interface UserState {
  localUsers: User[];
  apiUsers: User[];
  deletedApiUserIds: string[];
  loading: boolean;
  error: string | null;
  search: string;
  page: number;
  limit: number;
  total: number;
}

const initialState: UserState = {
  localUsers: [],
  apiUsers: [],
  deletedApiUserIds: [],
  loading: false,
  error: null,
  search: "",
  page: 1,
  limit: 10,
  total: 0,
};

const LOCAL_KEY = "local_users";

const saveToLocal = (users: User[]) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(users));
};

const loadFromLocal = (): User[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LOCAL_KEY);
  return data ? JSON.parse(data) : [];
};

export const fetchUsers = createAsyncThunk(
  "users/fetchHybridUsers",
  async ({
    page,
    limit,
    localCount,
  }: {
    page: number;
    limit: number;
    localCount: number;
  }) => {
    const skip = Math.max((page - 1) * limit - localCount, 0);
    const res = await axios.get(
      `https://dummyjson.com/users?limit=${limit}&skip=${skip}`
    );
    return { users: res.data.users, total: res.data.total };
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<Omit<User, "id">>) => {
      const newUser: User = {
        id: `USR-${Date.now()}`,
        ...action.payload,
        isNew: true,
      };
      const updatedLocal = [newUser, ...state.localUsers];
      state.localUsers = updatedLocal;
      saveToLocal(updatedLocal);
    },
    editUser: (state, action: PayloadAction<User>) => {
      const { id } = action.payload;

      const localIndex = state.localUsers.findIndex((u) => u.id === id);
      if (localIndex !== -1) {
        state.localUsers[localIndex] = action.payload;
        saveToLocal(state.localUsers);
        return;
      }

      const apiIndex = state.apiUsers.findIndex((u) => u.id === id);
      if (apiIndex !== -1) {
        state.apiUsers[apiIndex] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      state.localUsers = state.localUsers.filter((u) => u.id !== id);
      saveToLocal(state.localUsers);

      if (state.apiUsers.find((u) => u.id === id)) {
        state.deletedApiUserIds.push(id);
      }
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    loadLocalUsers: (state) => {
      state.localUsers = loadFromLocal();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.apiUsers = action.payload.users;
        state.total = action.payload.total + state.localUsers.length;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

export const {
  addUser,
  editUser,
  deleteUser,
  setSearch,
  setPage,
  loadLocalUsers,
} = userSlice.actions;

export default userSlice.reducer;

export const selectPaginatedUsers = (state: RootState) => {
  const {
    page,
    limit,
    search,
    localUsers,
    apiUsers,
    total,
    deletedApiUserIds,
  } = state.users;

  let combined: User[] = [];

  const localStart = (page - 1) * limit;
  const localEnd = page * limit;

  const localSlice = localUsers.slice(localStart, localEnd);

  const remainingSlots = limit - localSlice.length;

  const filteredApi = apiUsers.filter(
    (u) => !deletedApiUserIds.includes(u.id!)
  );

  if (remainingSlots > 0) {
    combined = [...localSlice, ...filteredApi.slice(0, remainingSlots)];
  } else {
    combined = [...localSlice];
  }

  let filtered = combined;
  if (search) {
    filtered = filtered.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      return (
        fullName.includes(search.toLowerCase()) ||
        u.firstName.toLowerCase().includes(search.toLowerCase()) ||
        u.lastName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    });
  }

  const totalPages = Math.ceil(total / limit) || 1;

  return { users: filtered, totalPages, total };
};
