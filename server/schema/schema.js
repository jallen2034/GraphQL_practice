const graphql = require('graphql')
const _ = require('lodash')
const { createAuthor } = require('../mutators.js')
const { 
  findBook, 
  findAuthorForBook, 
  findAllBooks, 
  findAllAuthors, 
  findSingleAuthor,
  findBooksForAuthors
} = require('../queries.js')

// grabbed all of these different properties from the graphQL package
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql

/* define our book and author types our root query will use
 * this book type has different fields: id, name and genre which are wrapped inside of a function
 * we also declare a book can also have authors too (cool huh?) */
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      async resolve(parent, args) {
        const foundAuthorForBook = await findAuthorForBook(parent)
        console.log("foundAuthorForBook")
        console.log(foundAuthorForBook)
        return foundAuthorForBook
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    author_name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args) {
        const foundBooksForAuthor = await findBooksForAuthors(parent)
        return foundBooksForAuthor
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
      async resolve(parent, args) {
        const foundBooks = await findBook(args)
        return foundBooks
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const foundSingleAuthor = await findSingleAuthor(args)
        return foundSingleAuthor
      }
    },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args) {
        const foundBooksArray = await findAllBooks()
        return foundBooksArray
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      async resolve(parent, args) {
        const foundAuthorsArray = await findAllAuthors()
        return foundAuthorsArray
      }
    }
  }
})

// mutation that updates the user in the database witht he correct mutation but doesn't return any data back
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      async resolve(parent, args) {
        const createdUser = await createAuthor(args)
        return createdUser
      }
    }
  }
})

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})