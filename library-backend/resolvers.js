const { UserInputError, AuthenticationError } = require('@apollo/server/errors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./models/user')
const Author = require('./models/author')
const Book = require('./models/book')
const logger = require('./utils/logger')

const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET'

const resolvers = {
  Query: {
    me: (root, args, context) => {
      console.log('mequery___________')
      console.log('Context mequery', context)
      return context.currentUser
    },

    allUsers: async () => {
      return User.find({})
    },

    bookCount: async () => Book.collection.countDocuments(),

    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      let query = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) query.author = author._id
      }
      if (args.genre) {
        query.genres = { $in: [args.genre] }
      }
      return Book.find(query).populate('author')
    },

    allAuthors: async () => {
      return Author.find({})
    },
  },

  Mutation: {
    createUser: async (root, args) => {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.password, saltRounds)

      const user = new User({
        username: args.username,
        name: args.name,
        favoriteGenre: args.favoriteGenre,
        passwordHash,
      })

      try {
        const savedUser = await user.save()
        logger.info(`User saved: ${savedUser.username}`)
        return savedUser
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      const passwordCorrect =
        user !== null &&
        (await bcrypt.compare(args.password, user.passwordHash))

      if (!(user && passwordCorrect)) {
        logger.error(`Login failed for username: ${args.username}`)
        throw new AuthenticationError('Invalid username or password')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      const token = jwt.sign(userForToken, JWT_SECRET)
      logger.info(`User logged in: ${user.username}`)
      return { value: token }
    },

    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('Not authenticated')
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
        logger.info(`New author created: ${author.name}`)
      }

      const book = new Book({ ...args, author })
      try {
        const savedBook = await book.save()
        await savedBook.populate('author')
        logger.info(`Book added: ${savedBook.title} by ${author.name}`)
        return savedBook
      } catch (error) {
        logger.error('Error adding book', { error, args })
        throw new UserInputError(error.message, { invalidArgs: args })
      }
    },

    editAuthor: async (root, args, context) => {
      console.log(context)
      if (!context.currentUser) {
        throw new AuthenticationError('Not authenticated')
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        logger.error(`Attempted to edit non-existing author: ${args.name}`)
        return null
      }

      author.born = args.setBornTo
      try {
        const updatedAuthor = await author.save()
        logger.info(
          `Author updated: ${updatedAuthor.name}, born set to ${updatedAuthor.born}`
        )
        return updatedAuthor
      } catch (error) {
        logger.error('Error editing author', { error, args })
        throw new UserInputError(error.message, { invalidArgs: args })
      }
    },
  },

  Author: {
    bookCount: async (root) => {
      return await Book.countDocuments({ author: root._id })
    },
  },
}

module.exports = resolvers
