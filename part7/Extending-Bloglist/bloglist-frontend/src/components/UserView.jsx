import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { initializeUsers, selectUserById } from '../redux/userSlice';

const UserView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => selectUserById(state, id));

  useEffect(() => {
    if (!user) {
      dispatch(initializeUsers());
    }
  }, [dispatch, user]);

  if (!user) {
    return <div>Loading user details...</div>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserView;
