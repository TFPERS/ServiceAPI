require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const flash = require('express-flash');
const session = require('express-session')
const errorHandler = require('./src/middlewares/error-handler')
const db = require('./src/models')
const multer = require('multer')
const upload = multer ({dest: "uploads/"})
// routes
const PORT = process.env.NODE_DOCKER_PORT || 5000;
app.use(cors({ origin: process.env.CLIENT_ORIGIN,
credentials: true }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash());
// Body parse middleware

app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })


db.sequelize.sync({
    // force: true,
});
app.use(morgan("dev"))
// global error handler
app.use(errorHandler)

app.use('/api/auth', require('./src/routes/api/auth.routes'))
app.use('/api/student', require('./src/routes/api/student.routes'))
app.use('/api/test', require('./src/routes/api/user.routes'))
app.use('/api/petition', require('./src/routes/api/petition.routes'))
app.use('/api/agency', require('./src/routes/api/agency.routes'))
app.use('/api/notification', require('./src/routes/api/notification.routes'))
app.use('/api/file', require('./src/routes/api/file.routes'))

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

const io = require('socket.io')(server, {
    cors: {
        origin: process.env.CLIENT_ORIGIN,
        credentials: true
    },
    secure: true
})

io.on("connection", (socket) => {
    console.log('connected to socket.io')

    socket.on('send_noti', () => {
        io.emit("receive_noti")
    })
})