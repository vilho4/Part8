require('dotenv').config()
const mongoose = require('mongoose')
const { ApolloServer } = require('@apollo/server')
const { UserInputError, AuthenticationError } = require('@apollo/server/errors')
const { startStandaloneServer } = require('@apollo/server/standalone')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const config = require('./utils/config')
const jwt = require('jsonwebtoken')
const logger = require('./utils/logger')
const JWT_SECRET = process.env.JWT_SECRET
const User = require('./models/user')

const mongoUrl = config.MONGODB_URI
// console.log(mongoUrl, "url");
mongoose.set('strictQuery', false)

logger.info('connecting to', mongoUrl)

mongoose
  .connect(mongoUrl)
  .then((result) => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
    return { currentUser: null }
  },
  cors: {
    origin: 'http://localhost:5173',
  },
}).then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`)
})

// startStandaloneServer(server, {
//   listen: { port: 4000 },
//   context: async ({ req }) => {
//     const auth = req ? req.headers.authorization : null
//     if (auth && auth.startsWith('Bearer ')) {
//       const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
//       const currentUser = await User.findById(decodedToken.id)
//       return { currentUser }
//     }
//     return { currentUser: null }
//   },
// }).then(({ url }) => {
//   logger.info(`Server ready at ${url}`)
// })
