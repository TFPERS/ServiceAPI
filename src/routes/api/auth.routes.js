const { verifySignUp } = require('../../middlewares')
const controller = require('../../controllers/student.controller')
const agency = require('../../controllers/agency.controller')

const express = require('express') 
const router = express.Router()

router.post('/signup',
    [
        verifySignUp.checkStudentDuplicateIdOrEmail,
    ],
    controller.signup
)

router.post('/signin', controller.signin)
router.post('/agency/signin', agency.signIn)
router.post('/agency/signup', agency.signup)
router.post('/google', controller.signinGoogle)
module.exports = router
