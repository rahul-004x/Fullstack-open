const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!  # This field returns the full Author object
    id: ID!
    genres: [String!]!
  }
  
  type Author {
    name: String!
    id: ID!
    born: String
    bookCount: Int!
  }

    type User {
    username: String!,
    favoriteGenre: String!,
    id: ID!
  }

  type Token {
    value: String!
  }
  
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks: [Book!]!
    allAuthors: [Author!]!
    findBooks(author: String!): [Book!]!
    booksByGenre(author: String, genre: String!): [Book!]!
    me: User
  }

  type Mutation {
    addBook (
      title: String!,
      published: Int!,
      author: String!,
      genres: [String!]!
    ): Book
    editAuthor (
      name: String!,
      setBornTo: Int!
    ) : Author

    createUser (
      username: String!,
      favoriteGenre: String!
    ): User
    login (
      username: String!,
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book
  }    
`

module.exports = typeDefs;
