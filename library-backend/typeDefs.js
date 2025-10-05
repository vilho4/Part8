const { gql } = require('graphql-tag')

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    name: String
    favoriteGenre: String!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Query {
    me: User
    allUsers: [User!]!
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(name: String!, setBornTo: Int!): Author

    createUser(
      username: String!
      name: String
      favoriteGenre: String!
      password: String!
    ): User

    login(username: String!, password: String!): Token
  }
`

module.exports = typeDefs
