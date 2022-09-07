const controller = require('../../controllers/notification.controller')

const express = require('express') 
const router = express.Router()


router.get('/student/:studentId', controller.notificationEachStudent)
router.get('/student', controller.notificationAll)
router.put('/update/status/:studentId', controller.notificationReadingAlready)
router.get('/agency/', controller.allNotificationForAgency)
router.post('/agency/addNotiForAllStd', controller.addNotificationByAgencyForAllStudent)

module.exports = router
