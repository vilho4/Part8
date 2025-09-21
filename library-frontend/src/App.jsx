import { useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author
      genres
      id
    }
  }
`

const App = () => {
  const [page, setPage] = useState('authors')

  const { data: authorsData, loading: authorsLoading } = useQuery(ALL_AUTHORS)
  const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS)

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors
        show={page === 'authors'}
        data={authorsData}
        loading={authorsLoading}
      />
      <Books show={page === 'books'} data={booksData} loading={booksLoading} />
      <NewBook show={page === 'add'} />
    </div>
  )
}

export default App
