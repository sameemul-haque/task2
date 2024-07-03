import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from './firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

interface User {
  id: string;
  name: string;
  age: number;
  image: string;
}

interface UsersState {
  users: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: UsersState = {
  users: [],
  status: 'idle',
};

export const fetchUsers: any = createAsyncThunk('users/fetchUsers', async () => {
  const q = query(collection(db, 'usersdata'), orderBy('name'));
  const querySnapshot = await getDocs(q);
  const usersData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as User[];
  return usersData;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser(state, action) {
      state.users.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { addUser } = usersSlice.actions;

export default usersSlice.reducer;
