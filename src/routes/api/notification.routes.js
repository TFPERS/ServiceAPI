const controller = require('../../controllers/notification.controller')

const express = require('express') 
const router = express.Router()


router.get('/student/:studentId', controller.notificationEachStudent)
router.get('/student', controller.notificationAll)
router.put('/update/status/:studentId', controller.notificationReadingAlready)
router.get('/agency/', controller.allNotificationForAgency)
router.get('/agency/paginate', controller.NotiPaginate)
router.post('/agency/addNotiForAllStd', controller.addNotificationByAgencyForAllStudent)
router.delete('/agency/delete/:notiId', controller.deleteNotiById)
router.put('/agency/update/descript/:notiId', controller.updateDescript)

module.exports = router
