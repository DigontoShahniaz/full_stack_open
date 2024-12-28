import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });

  const addBlog = async (event) => {
    event.preventDefault();

    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    });
    setNewBlog({ title: "", author: "", url: "" });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={addBlog}>
        <div>
          Title{" "}
          <input
            name="title"
            value={newBlog.title}
            onChange={handleChange}
            placeholder="Enter blog title"
          />
        </div>
        <div>
          Author:{" "}
          <input
            name="author"
            value={newBlog.author}
            onChange={handleChange}
            placeholder="Enter blog author"
          />
        </div>
        <div>
          URL:{" "}
          <input
            name="url"
            value={newBlog.url}
            onChange={handleChange}
            placeholder="Enter blog url"
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default BlogForm;