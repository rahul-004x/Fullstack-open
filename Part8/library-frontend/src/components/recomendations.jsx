import { useQuery } from "@apollo/client";
import { ME, BOOK_FILTER } from "../queries";
import { useState, useEffect } from "react";
import { DNA } from 'react-loader-spinner'

const Recomendation = (props) => {
  const [genre, setGenre] = useState('');
  const { loading: meLoading, error: meError, data: meData } = useQuery(ME, {
    context: {
      headers: {
        authorization: `Bearer ${localStorage.getItem('library-user-token')}`
      }
    }
  });

  const { loading: filterLoading, data: filterData } = useQuery(BOOK_FILTER, {
    variables: { genre },
    skip: !genre
  });

  useEffect(() => {
    const token = localStorage.getItem('library-user-token');
    console.log('Token:', token); 

    if (meData && meData.me) {
      console.log('ME data:', meData); // Debug ME data
      setGenre(meData.me.favoriteGenre);
    }
  }, [meData]);

  if (!props.show) {
    return null;
  }

  if (meLoading || filterLoading) {
    return <div><DNA
    visible={true}
    height="60"
    width="60"
    ariaLabel="dna-loading"
    wrapperStyle={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100px'
    }}
    wrapperClass="dna-wrapper"
    /></div>;
  }

  if (meError) {
    return <div>Please login first</div>;
  }

  const books = filterData?.booksByGenre || [];

  return (
    <>
      <h2>Recomendations</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map(a => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Recomendation;