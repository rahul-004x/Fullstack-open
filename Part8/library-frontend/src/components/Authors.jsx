import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import AuthorForm from './Edit_Author'
import { ThreeDots } from 'react-loader-spinner'

const Authors = (props) => {
  if (!props.show) {
    return null
  }

  const { loading, error, data } = useQuery(ALL_AUTHORS)

  if (loading) return (
  <ThreeDots
  visible={true}
  height="50"
  width="50"
  color="#808080"
  radius="6"
  ariaLabel="three-dots-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />
  )
  if (error) return <p>Error: {error.message}</p>

  const authors = data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AuthorForm authors={authors} />
    </div>
  )
}

export default Authors
