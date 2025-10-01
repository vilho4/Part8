import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

import { EDIT_AUTHOR, ALL_AUTHORS, ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const handleEditAuthor = async ({ name, setBornTo }) => {
    await editAuthor({
      variables: { name, setBornTo },
      refetchQueries: [{ query: ALL_AUTHORS }]
    })
  }

  const { data: authorsData, loading: authorsLoading } = useQuery(ALL_AUTHORS, {
    pollInterval: 2000 // kysely 2s välein välimuistin päivitykseksi
  })
  const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS)

  if (authorsLoading) {
    return <div>Loading authors...</div>
  }
  if (booksLoading) {
    return <div>Loading books...</div>
  }

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
        onEdit={handleEditAuthor}
      />
      <Books show={page === 'books'} data={booksData} />
      <NewBook show={page === 'add'} />
    </div>
  )
}

export default App
