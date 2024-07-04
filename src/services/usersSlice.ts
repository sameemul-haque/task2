import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from './firebaseConfig';
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
  hasMoreData: boolean;
}

const initialState: UsersState = {
  users: [],
  status: 'idle',
  lastVisible: null,
  hasMoreData: true,
};

export const fetchUsers: any = createAsyncThunk('users/fetchUsers', async ({ lastVisible, limitCount }: { lastVisible: any, limitCount: number }) => {
  let q = query(collection(db, 'usersdata'), orderBy('timestamp', 'desc'), limit(limitCount));
  if (lastVisible) {
    q = query(collection(db, 'usersdata'), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(limitCount));
  }
  const querySnapshot = await getDocs(q);
  const usersData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as User[];
  const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
  const hasMoreData = querySnapshot.docs.length === limitCount;
  return { usersData, lastVisibleDoc, hasMoreData };
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser(state, action) {
      state.users.unshift(action.payload);
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
        state.hasMoreData = action.payload.hasMoreData;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { addUser } = usersSlice.actions;

export default usersSlice.reducer;