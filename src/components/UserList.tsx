import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../services/store';
import { fetchUsers } from '../services/usersSlice';

const UserList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);
  const status = useSelector((state: RootState) => state.users.status);
  const lastVisible = useSelector((state: RootState) => state.users.lastVisible);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers({ lastVisible: null, limitCount: 10}));
    }
  }, [status, dispatch]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
    if (bottom && status !== 'loading') {
      dispatch(fetchUsers({ lastVisible, limitCount: 10}));
    }
  }, [dispatch, lastVisible, status]);

  return (
    <div onScroll={handleScroll} className="h-[90vh] overflow-auto">
      {users.map((user) => (
        <div key={user.id} className="flex items-center border border-b-gray-300 rounded p-2 space-x-2">
          <img src={user.image} alt={user.name} className="w-8 h-8 object-cover rounded-full" />
          <div className="flex flex-col">
            <p className="text-xl font-semibold">{user.name}</p>
            <p className="text-xl">{user.age}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;