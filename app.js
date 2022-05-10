require('dotenv').config()

const express = require('express')
const app = express()

const cookieParser = require('cookie-parser')

const mysql = require('mysql')

const PORT = process.env.PORT || 5000
//Create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
})

db.connect((err) => {
    if(err) {
        throw err
    }
    console.log('Mysql Connected...')
})

app.use(express.json())
app.use(cookieParser())

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
