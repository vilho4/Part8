import SetBirthYear from './SetBirthYear'

const Authors = ({ show, data, onEdit }) => {
  if (!show) {
    return null
  }

  const authors = data.allAuthors

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born ?? '—'}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SetBirthYear authors={authors} onSubmit={onEdit} />
    </div>
  )
}

export default Authors
