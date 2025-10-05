import { useQuery } from '@apollo/client'
import { useEffect } from 'react'

const FavouriteBooks = ({ show, books, meDataResults }) => {
  // console.log(show)
  // console.log(books)
  // console.log(meDataResults)

  if (!show) {
    return null
  }
  const bookList = books?.allBooks || []

  if (!meDataResults) {
    return <p>Please log in to see your favourite books.</p>
  }

  const favoriteGenre = meDataResults.favoriteGenre
  if (!favoriteGenre) {
    return <p>No favourite genre found for your profile.</p>
  }

  // console.log(favoriteGenre)

  const filteredBooks = bookList.filter((book) =>
    book.genres.includes(favoriteGenre)
  )

  return (
    <div>
      <h2>Favourite books ({favoriteGenre})</h2>
      {filteredBooks.length === 0 ? (
        <p>No books found in your favourite genre.</p>
      ) : (
        <ul>
          {filteredBooks.map((book) => (
            <li key={book.id}>
              {book.title} by {book.author.name} ({book.published})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FavouriteBooks
