import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries';



const NewBook = (props) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!props.token) {
    return <div>Please log in to access this feature.</div>;
  }

  if (!props.show) {
    return null;
  }

  const publishedInt = parseInt(published, 10);

  const submit = async (event) => {
    event.preventDefault();

    const normalizedGenres = genres.map((g) => g.trim().toLowerCase());
    createBook({ variables: { title, author, published: publishedInt, genres: normalizedGenres } });

    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');
  };

  const addGenre = () => {
    if (genre.trim()) {
      const normalizedGenre = genre.trim().toLowerCase();
      if (!genres.includes(normalizedGenre)) {
        setGenres(genres.concat(normalizedGenre));
      }
      setGenre('');
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};


export default NewBook;

