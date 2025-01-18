import { useState, useEffect } from "react";
import { useApolloClient, useSubscription } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recomendation from "./components/recomendations";
import { ADDED_BOOK, ALL_BOOKS, ME } from "./queries";

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState("authors");
  const client = useApolloClient()

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if (token) {
      setToken(token)
    }
  }, [])

  const logout = () => {
    setToken(null)
    setPage('authors')
    localStorage.clear()
    client.resetStore()
  }

  const handleLogin = (token) => {
    setToken(token)
    setPage("authors")
    client.refetchQueries({
      include: [{ query: ME }]
    })
  }

  useSubscription(ADDED_BOOK, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      window.alert(`New book added: ${addedBook.title} by ${addedBook.author.name}`)

      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook)
        }
      })
    }
  })

  return (
    <>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage('recomendation')}>recomendation</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      {token && <NewBook show={page === "add"} />}
      <Recomendation show={page === 'recomendation'} />
      {!token && page === "login" && <LoginForm show={page === "login"} setToken={handleLogin} />}
    </>
  );
};

export default App;