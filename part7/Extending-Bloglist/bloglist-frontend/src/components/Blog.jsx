import { useState } from "react";
import { useDispatch } from "react-redux";
import blogService from "../services/blogs";
import { likeBlog, deleteBlog } from "../redux/reducers/blogReducer";

const Blog = ({ blog, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const dispatch = useDispatch();

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
    };
    dispatch(likeBlog(updatedBlog));
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${blog.title}"?`,
    );
    if (confirmDelete) {
      dispatch(deleteBlog(blog.id));
    }
  };

  return (
    <div className="blog" style={blogStyle}>
      <div data-testid={blog.title}>
        {blog.title} by {blog.author}
      </div>
      <button onClick={toggleDetails} data-testid="view">
        {detailsVisible ? "hide" : "view"}
      </button>
      {detailsVisible && (
        <div>
          <p>{blog.url}</p>
          <p data-testid="like-button">
            Likes: <span>{blog.likes}</span>{" "}
            <button onClick={handleLike}>Like</button>
          </p>
          <p>Added by: {blog.user.name}</p>
          {user && blog.user.username === user.username && (
            <button onClick={handleDelete} style={{ color: "red" }}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;