const { verifySignUp } = require('../../middlewares')
const controller = require('../../controllers/petition.controller')
const multer = require('../../config/multer.config')
 
const express = require('express') 
const router = express.Router()

router.post('/form', controller.petitionForm)
router.put('/update/:id', controller.petitionUpdate)
router.get('/', controller.petitionAll)
router.get('/paginate', controller.petitionPaginate)
router.get('/paginateTest', controller.petitionTest)
router.get('/student/:id', controller.petitionByStudentId)
router.get('/downloadRO01',controller.downloadRO01)
router.get('/downloadRO03',controller.downloadRO03)
router.post('/waiverfees', multer.uploadStorage.array("files") , controller.waiverfee)
router.get('/one/:id/:studentId', controller.getPetitionById)
router.put('/update/waiverfees/:petitionId', multer.updateStorage.array("files") , controller.updateWaiverfee)

module.exports = router
