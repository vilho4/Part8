import { useState } from 'react'
import Select from 'react-select'

const SetBirthYear = ({ authors, onSubmit }) => {
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [bornYear, setBornYear] = useState('')

  const options = authors.map((a) => ({ value: a.name, label: a.name }))

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!selectedAuthor || !bornYear) return

    onSubmit({
      name: selectedAuthor.value,
      setBornTo: Number(bornYear)
    })

    setSelectedAuthor(null)
    setBornYear('')
  }

  return (
    <div>
      <h3>Set birth year</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ width: 200, marginBottom: 10 }}>
          <Select
            value={selectedAuthor}
            onChange={setSelectedAuthor}
            options={options}
            placeholder="Select author"
          />
        </div>
        <div>
          Birth year:{' '}
          <input
            type="number"
            value={bornYear}
            onChange={({ target }) => setBornYear(target.value)}
          />
        </div>
        <button type="submit" disabled={!selectedAuthor || !bornYear}>
          Update
        </button>
      </form>
    </div>
  )
}

export default SetBirthYear
