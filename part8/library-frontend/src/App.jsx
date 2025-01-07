import { useState, useEffect } from "react";
import { useSubscription } from '@apollo/client'
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommend from "./components/Recommend";
import LoginForm from "./components/LoginForm";
import { ALL_BOOKS, BOOK_ADDED } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null)

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded

      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook),
        }
      })
    }
  })



  useEffect(() => {
    const savedToken = localStorage.getItem("library-token");
    if (savedToken) {
      setToken(savedToken); 
    }
  }, []);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("library-token");
    setPage("authors");
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={handleLogout}>logout</button>
          </>
        )}
        {!token && <button onClick={() => setPage("login")}>login</button>}
      </div>

      {!token && page === "login" && <LoginForm setToken={setToken} />}
      {token && (
        <>
          <Authors show={page === "authors"} />
          <Books show={page === "books"} />
          <NewBook show={page === "add"} token={token} />
          <Recommend show={page === "recommend"} token={token} />
        </>
      )}
    </div>
  );
};

export default App;
