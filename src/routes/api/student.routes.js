const controller = require('../../controllers/student.controller')
const { verifyEditUser, authJwt } = require('../../middlewares')
const express = require('express') 
const router = express.Router()

router.get('/me/:id', controller.studentById)
router.put('/update/:id', [
            verifyEditUser.checkEmailExists,
            verifyEditUser.checkFieldIsEmpty,
            authJwt.verifyToken
        ]
        ,controller.studentUpdate)
module.exports = router
