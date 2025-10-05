import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink
} from '@apollo/client'

import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
})

// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem('library-user-token')
//   const authorization = token ? `Bearer ${token}` : ''

//   console.log('Authorization header being sent:', authorization)

//   return {
//     headers: {
//       ...headers,
//       authorization
//     }
//   }
// })

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  if (!token) {
    return { headers }
  }
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`
    }
  }
})

// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem('library-user-token')
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : ''
//     }
//   }
// })

// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors)
//     graphQLErrors.forEach(({ message, path }) =>
//       console.log(`[GraphQL error]: Message: ${message}, Path: ${path}`)
//     )
//   if (networkError) console.log(`[Network error]: ${networkError}`)
// })

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

// const client = new ApolloClient({
//   link: errorLink.concat(httpLink), // käytä errorLink + httpLink
//   cache: new InMemoryCache()
// })

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
