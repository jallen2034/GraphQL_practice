const { db } = require('./db')

// helper function to delete a saved park from user list
const createAuthor = function (args) {
  console.log("Hi in createAuthor!")
  const parameters = [args.name, args.age]
  const query = `
   INSERT INTO authors(name, age)
   VALUES ($1, $2)
   RETURNING *;
  `

  return db.query(query, parameters)
    .then(res => {
      return res.rows[0]
    })
    .catch(error => {
      console.log("Error: ", error)
    })
}

// export helper functions to be used elsewhere
module.exports = {
  createAuthor
}