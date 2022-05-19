const { verifySignUp } = require('../../middlewares')
const controller = require('../../controllers/student.controller')

const express = require('express') 
const router = express.Router()

router.post('/signup',
    [
        verifySignUp.checkStudentDuplicateIdOrEmail,
    ],
    controller.signup
)

router.post('/signin', controller.signin)
module.exports = router
