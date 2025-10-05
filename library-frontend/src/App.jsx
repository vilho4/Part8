import { useState } from 'react'
import { useQuery, useMutation, useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

import { EDIT_AUTHOR, ALL_AUTHORS, ALL_BOOKS, ME } from './queries'
import LoginForm from './components/LoginForm'
import FavouriteBooks from './components/FavouriteBooks'

const App = () => {
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  const {
    data: authorsData,
    loading: authorsLoading,
    error: authorsError
  } = useQuery(ALL_AUTHORS)

  const { data: meData, refetch: refetchMe } = useQuery(ME)
  const meDataResults = meData?.me || null
  refetchMe()

  // console.log(meDataResults)

  // console.log(authorsData, authorsLoading, authorsError)

  const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS)

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const handleEditAuthor = async ({ name, setBornTo }) => {
    await editAuthor({
      variables: { name, setBornTo },
      refetchQueries: [{ query: ALL_AUTHORS }]
    })
  }

  if (authorsLoading) {
    return <div>Loading authors...</div>
  }
  if (booksLoading) {
    return <div>Loading books...</div>
  }

  const logout = () => {
    // console.log('logout 1', token)
    setToken(null)
    // console.log('logout 2', token)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && (
          <button onClick={() => setPage('favourites')}>favourites</button>
        )}
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div>
        {token ? (
          <button onClick={logout}>logout</button>
        ) : (
          <LoginForm setToken={setToken} setError={setError} />
        )}
      </div>

      <Authors
        show={page === 'authors'}
        data={authorsData}
        onEdit={handleEditAuthor}
      />
      <NewBook show={page === 'newbook'} />
      <Books show={page === 'books'} data={booksData} />
      <NewBook show={page === 'add'} />
      <FavouriteBooks
        show={page === 'favourites'}
        books={booksData}
        meDataResults={meDataResults}
      />
    </div>
  )
}

export default App
