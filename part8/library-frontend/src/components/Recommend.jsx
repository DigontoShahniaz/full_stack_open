import { useQuery } from '@apollo/client';
import { ALL_BOOKS_BY_GENRE, ME } from '../queries';


const Recommend = () => {
  const { data: userData, loading: userLoading } = useQuery(ME);
  const favoriteGenre = userData?.me?.favoriteGenre;

  const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre,
  });

  if (userLoading || booksLoading) {
    return <div>loading...</div>;
  }

  if (!userData || !booksData) {
    return <div>No recommendations available</div>;
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        Books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          {booksData.allBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
