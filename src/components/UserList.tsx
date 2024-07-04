import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../services/store';
import { fetchUsers } from '../services/usersSlice';

const UserList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);
  const status = useSelector((state: RootState) => state.users.status);
  const lastVisible = useSelector((state: RootState) => state.users.lastVisible);
  const hasMoreData = useSelector((state: RootState) => state.users.hasMoreData);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers({ lastVisible: null, limitCount: 10 }));
    }
  }, [status, dispatch]);

  const fetchMoreData = () => {
    if (status !== 'loading' && hasMoreData) {
      dispatch(fetchUsers({ lastVisible, limitCount: 10 }));
    }
  };

  return (
    <InfiniteScroll
      dataLength={users.length}
      next={fetchMoreData}
      hasMore={hasMoreData}
      scrollThreshold={0.9}
      loader={
        <div className="w-full flex items-center justify-center p-2">
          <div className="w-12 h-12 border-4 text-blue-400 animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full">
          </div>
        </div>
      }
    >
      {users.map((user) => (
        <div key={user.id} className="flex items-center border border-b-gray-300 rounded p-2 space-x-2">
          <img src={user.image} alt={user.name} className="w-8 h-8 object-cover rounded-full" />
          <div className="flex flex-col">
            <p className="text-xl font-semibold">{user.name}</p>
            <p className="text-xl">{user.age}</p>
          </div>
        </div>
      ))}
    </InfiniteScroll>
  );
};

export default UserList;