import { useState } from 'react'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null)

  if (!props.show) {
    return null
  }

  if (!props.data) {
    return <div>loading...</div>
  }

  const books = props.data.allBooks

  const genres = [...new Set(books.flatMap((book) => book.genres))]

  const filteredBooks = selectedGenre
    ? books.filter((book) => book.genres.includes(selectedGenre))
    : books

  return (
    <div>
      <h2>Books</h2>

      <div>
        <strong>Filter by genre:</strong>{' '}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
        {genres.map((g) => (
          <button key={g} onClick={() => setSelectedGenre(g)}>
            {g}
          </button>
        ))}
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
