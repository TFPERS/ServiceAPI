const controller = require('../../controllers/notification.controller')

const express = require('express') 
const router = express.Router()


router.get('/student/:studentId', controller.notificationEachStudent)
router.get('/student', controller.notificationAll)

module.exports = router
