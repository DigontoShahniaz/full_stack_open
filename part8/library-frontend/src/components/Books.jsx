import { useState } from 'react';
import { useQuery } from '@apollo/client';

import { ALL_BOOKS } from '../queries';


const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { data, loading, error } = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const genres = Array.from(new Set(data.allBooks.flatMap((b) => b.genres)));
  return (
    <div>
      <h2>Books</h2>
      {selectedGenre && (
        <p>
          Books in genre: <strong>{selectedGenre}</strong>
        </p>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {data.allBooks
            .filter((b) => !selectedGenre || b.genres.includes(selectedGenre))
            .map((b) => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setSelectedGenre(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>All Genres</button>
      </div>
    </div>
  );
};

export default Books;
