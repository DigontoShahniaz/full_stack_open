import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import Select from "react-select";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";



const Authors = (props) => {
  const [born, setBorn] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const { data, loading, error } = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });


  if (!props.show) {
    return null;
  }

 

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleSaveBirthYear = (event) => {
    event.preventDefault();
    if (born && selectedAuthor) {
      editAuthor({
        variables: {
          name: selectedAuthor.name,
          setBornTo: parseInt(born, 10),
        },
      });
      setSelectedAuthor(null);
      setBorn("");
    }
  };

  const authorOptions = data.allAuthors.map((author) => ({
    value: author.name,
    label: author.name,
  }));

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {data.allAuthors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Edit Birth Year</h3>
      <form onSubmit={handleSaveBirthYear}>
        <div>
          <label>Select Author:</label>
          <Select
            options={authorOptions}
            value={selectedAuthor ? { label: selectedAuthor.name, value: selectedAuthor.name } : null}
            onChange={(option) =>
              setSelectedAuthor(data.allAuthors.find((a) => a.name === option.value))
            }
          />
        </div>
        {selectedAuthor && (
          <div>
            <label>Born Year:</label>
            <input
              type="number"
              value={born}
              onChange={(e) => setBorn(e.target.value)}
            />
          </div>
        )}
        <button type="submit" disabled={!selectedAuthor || !born}>
          Update Birth Year
        </button>
      </form>
    </div>
  );
};

export default Authors;
