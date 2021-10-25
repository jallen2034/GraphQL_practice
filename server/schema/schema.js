const graphql = require('graphql')
const _ = require('lodash')
const { createAuthor } = require('../model.js')

// grabbed all of these different properties from the graphQL package
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql

// dummy data that would come from a db later
let books = [
  { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
  { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
  { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
  { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
  { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
  { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' }
]

let authors = [
  { name: 'Patrick Rothfuss', age: 44, id: '1' },
  { name: 'Jacob Allen', age: 42, id: '2' },
  { name: 'Terry Pratchett', age: 66, id: '3' }
]

/* define our first object type which is a book type
 * this book type has different fields: id, name and genre which are wrapped inside of a function */
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent)
        return _.find(authors, { id: parent.authorId })
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        console.log(parent)
        return _.filter(books, { authorId: parent.id })
      }
    }
  })
})

/* define our root query which is how we jump into our graph
 * all of the fields in here are all going to have the different options of how we're going to jump into our graph
 * our defined book field define when somone wantes to query for a book, then we want you to use this thing to go get it */
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data / other sources - use lodash to look through books array + return any book that has an id equal to identical to the one attached to the args sent
        return _.find(books, { id: args.id })
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id })
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors
      }
    }
  }
})

// this is broken, updates the user in the database witht he correct mutation but doesn't return any data back
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        let createdUser = createAuthor(args)
        createdUser.then((value) => {
          console.log(value)
          return value
        })
      }
    }
  }
})

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})