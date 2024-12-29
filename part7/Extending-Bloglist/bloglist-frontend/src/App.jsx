import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import Users from "./components/Users";
import UserView from "./components/UserView";
import { setNotification, clearNotification } from "./redux/notificationSlice";
import { initializeBlogs, createBlog } from "./redux/reducers/blogReducer";
import { setUser, clearUser } from "./redux/reducers/userReducer";

const App = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const blogFormRef = useRef();

  const notify = (message, isError = false) => {
    dispatch(setNotification({ message, isError }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      notify("Logged in successfully");
      setUsername("");
      setPassword("");
    } catch (exception) {
      notify("Wrong credentials", true);
    }
  };

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(clearUser());
    notify("Logout successful");
    window.localStorage.removeItem("loggedBlogAppUser");
  };

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      await dispatch(createBlog(blogObject));
      notify(`Blog "${blogObject.title}" by ${blogObject.author} added successfully!`);
    } catch (error) {
      notify("Failed to add the blog. Please try again.", true);
    }
  };

  if (!user) {
    return (
      <div>
        <Notification message={notification.message} isError={notification.isError} />
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    );
  }

  return (
    <Router>
      <div>
        <Notification message={notification.message} isError={notification.isError} />
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>
        <nav>
          <Link to="/blogs">Blogs</Link>
          {" | "}
          <Link to="/users">Users</Link>
        </nav>
        <Routes>
          <Route
            path="/"
            element={<Navigate replace to="/blogs" />}
          />
          <Route
            path="/blogs"
            element={
              <div>
                <Togglable buttonLabel="new blog" ref={blogFormRef}>
                  <BlogForm createBlog={addBlog} />
                </Togglable>
                <h3>Blogs</h3>
                {blogs.map((blog) => (
                  <Blog key={blog.id} blog={blog} user={user} />
                ))}
              </div>
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
