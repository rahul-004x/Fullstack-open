import { useQuery } from '@apollo/client'
import { ALL_BOOKS, BOOK_FILTER } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  const [genre, setGenre] = useState('all')
  const allBooksResult = useQuery(ALL_BOOKS)
  const filteredBooksResult = useQuery(BOOK_FILTER, {
    variables: { genre: genre },
    skip: genre === 'all'
  })

  if (!props.show) {
    return null
  }

  if(allBooksResult.loading || filteredBooksResult.loading) return <p>Loading...</p>
  if(allBooksResult.error) return <p>Error: {allBooksResult.error.message}</p>
  if(filteredBooksResult.error && genre !== 'all') return <p>Error: {filteredBooksResult.error.message}</p>

  const books = genre === 'all' 
    ? allBooksResult.data?.allBooks || []
    : filteredBooksResult.data?.booksByGenre || [] 

  console.log('Books data:', books) 

  // Get unique genres from all books
  const uniqueGenres = [...new Set(
    allBooksResult.data?.allBooks.flatMap(book => book.genres) || []
  )]
  const genres = [...uniqueGenres, 'all']

  return (
    <div>
      <h2>books</h2>
      {genre && <p>in genre <strong>{genre}</strong></p>}

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
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map(g => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books