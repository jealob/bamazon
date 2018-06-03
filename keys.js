// exports the file with the key 
let database_db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: "bamazon"
    }
    
    module.exports = {
        Database: database_db
    }