const { verifySignUp } = require('../../middlewares')
const controller = require('../../controllers/petition.controller')
const uploadStorage = require('../../config/multer.config')
 
const express = require('express') 
const router = express.Router()

router.post('/form', controller.petitionForm)
router.put('/update/status/:id', controller.petitionUpdateStatus)
router.get('/', controller.petitionAll)
router.get('/paginate', controller.petitionPaginate)
router.get('/student/:id', controller.petitionByStudentId)
router.get('/test',controller.testFindSearch)
router.get('/downloadRO01',controller.downloadRO01)
router.get('/downloadRO03',controller.downloadRO03)
router.post('/waiverfees', uploadStorage.array("files") , controller.waiverfee)

module.exports = router
