const { GraphQLError } = require('graphql')
const Author = require('./models/author')
const Book = require('./models/book')

const resolvers = {
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          if (error.name === 'ValidationError') {
            throw new GraphQLError(error.message, {
              extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.author },
            })
          }
          throw error
        }
      }

      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
      } catch (error) {
        if (error.name === 'ValidationError') {
          throw new GraphQLError(error.message, {
            extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.title },
          })
        }
        if (error.code === 11000) {
          // unique title
          throw new GraphQLError('Book title must be unique', {
            extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.title },
          })
        }
        throw error
      }

      return book.populate('author')
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) return null

      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        if (error.name === 'ValidationError') {
          throw new GraphQLError(error.message, {
            extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.setBornTo },
          })
        }
        throw error
      }
      return author
    },
  },
}

module.exports = resolvers
