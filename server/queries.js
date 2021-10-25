const { db } = require('./db')

// queries
const findBook = function (args) {
  const parameters = [args.id]
  const query = `select *
  from books 
  where books.id = $1
  `

  return db.query(query, parameters)
    .then(res => {
      return res.rows[0]
    })
    .catch(error => {
      console.log("Error: ", error)
    })
}

const findAuthorForBook = function (parent) {
  const parameters = [parent.id]
  const query = `select author_name, age
  from books 
  join author_books on books.id = author_books.book_id
  join authors on authors.id = author_books.book_id
  where books.id = $1
  `
  return db.query(query, parameters)
  .then(res => {
    return res.rows[0]
  })
  .catch(error => {
    console.log("Error: ", error)
  })
}

const findAllBooks = function () {
  const query = `select * from books`

  return db.query(query)
  .then(res => {
    return res.rows
  })
  .catch(error => {
    console.log("Error: ", error)
  })
}

const findSingleAuthor = function (args) {
  const parameters = [args.id]
  const query = `select * from authors where id = $1`

  return db.query(query, parameters)
  .then(res => {
    return res.rows[0]
  })
  .catch(error => {
    console.log("Error: ", error)
  })
}

const findBooksForAuthors = function (parent) {
  const parameters = [parent.id]
  const query = `select *
  from books
  join author_books on books.id = author_books.book_id
  where authorid = $1`

  return db.query(query, parameters)
  .then(res => {
    return res.rows
  })
  .catch(error => {
    console.log("Error: ", error)
  })
}

const findAllAuthors = function () {
  const query = `select * from authors`

  return db.query(query)
  .then(res => {
    return res.rows
  })
  .catch(error => {
    console.log("Error: ", error)
  })
}


// export helper functions to be used elsewhere
module.exports = {
  findBook,
  findSingleAuthor,
  findAuthorForBook,
  findAllBooks,
  findAllAuthors,
  findBooksForAuthors
}