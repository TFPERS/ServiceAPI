require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const errorHandler = require('./src/middlewares/error-handler')
const db = require('./src/models')
// routes
const Role = db.role
app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })
db.sequelize.sync();
// db.sequelize.sync({force: true}).then(() => {
//     console.log('Drop and Resync Db');
//     initial();
//   });
// function initial() {
//     Role.create({
//         id: 1,
//         name: "user"
//     });
    
//     Role.create({
//       id: 2,
//       name: "moderator"
//     });
  
//     Role.create({
//       id: 3,
//       name: "admin"
//     });
//   }
app.use(morgan("dev"))

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(cookieParser())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
// Body parse middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// global error handler
app.use(errorHandler)

app.use('/api/auth', require('./src/routes/api/auth.routes'))
app.use('/api/student', require('./src/routes/api/student.routes'))
app.use('/api/test', require('./src/routes/api/user.routes'))
app.use('/api/petition', require('./src/routes/api/petition.routes'))

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})


