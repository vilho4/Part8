const Books = (props) => {
  // // console.log(props)
  if (!props.show) {
    return null
  }

  if (!props.data) {
    return <div>loading...</div>
  }

  // if (props.show === true) {
  // //   console.log(props.data.allBooks)
  // }

  const books = props.data.allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
