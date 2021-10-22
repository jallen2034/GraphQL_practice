const graphql = require('graphql')
const _ = require('lodash')

// grabbed all of these different properties from the graphQL package
const { 
  GraphQLObjectType, 
  GraphQLString,
  GraphQLSchema,
  GraphQLID 
} = graphql

// dummy data that would come from a db later
let books = [
  {name: 'Name of the Wind', genre: 'Fantasy', id: '1' },
  {name: 'The Final Empire', genre: 'Fantasy', id: '2' },
  {name: 'The Long Earth', genre: 'Sci-Fi', id: '3' }
]

/* define our first object type which is a book type
 * this book type has different fields: id, name and genre which are wrapped inside of a function */
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString},
    genre: { type: GraphQLString }
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
      args: { id: {type: GraphQLID} },
      resolve(parent, args) {
        // code to get data / other sources - use lodash to look through books array + return any book that has an id equal to identical to the one attached to the args sent
        return _.find(books, {id: args.id})
      }
    }
  }
})

module.exports = new graphql.GraphQLSchema({
  query: RootQuery
})