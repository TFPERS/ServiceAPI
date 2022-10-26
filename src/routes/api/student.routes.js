const controller = require('../../controllers/student.controller')
const { verifyEditUser, authJwt } = require('../../middlewares')
const express = require('express') 
const router = express.Router()

router.get('/me/:id', controller.studentById)
router.put('/update/:id', [
            authJwt.verifyToken,
            verifyEditUser.checkEmailExists,
            verifyEditUser.checkFieldIsEmpty,
        ]
        ,controller.studentUpdate)
router.post('/forgot-password', controller.forgotPassword)
router.get('/reset-password/:id/:token', controller.verifyUrl)
router.post('/reset-password/:id/:token', controller.resetPassword)
module.exports = router
