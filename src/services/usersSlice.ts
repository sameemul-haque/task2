import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from './firebase';
import { collection, getDocs, orderBy, query, startAfter, limit } from 'firebase/firestore';

interface User {
  id: string;
  name: string;
  age: number;
  image: string;
  timestamp: number;
}

interface UsersState {
  users: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  lastVisible: any; 
}

const initialState: UsersState = {
  users: [],
  status: 'idle',
  lastVisible: null,
};

export const fetchUsers: any = createAsyncThunk('users/fetchUsers', async ({ lastVisible, limitCount }: { lastVisible: any, limitCount: number }) => {
  let q = query(collection(db, 'usersdata'), orderBy('timestamp'), limit(limitCount));
  if (lastVisible) {
    q = query(collection(db, 'usersdata'), orderBy('timestamp'), startAfter(lastVisible), limit(limitCount));
  }
  const querySnapshot = await getDocs(q);
  const usersData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as User[];
  const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
  return { usersData, lastVisibleDoc };
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
        const newUsers = action.payload.usersData.filter(
          (newUser: { id: string; }) => !state.users.some((existingUser) => existingUser.id === newUser.id)
        );
        state.users = [...state.users, ...newUsers];
        state.lastVisible = action.payload.lastVisibleDoc;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { addUser } = usersSlice.actions;

export default usersSlice.reducer;