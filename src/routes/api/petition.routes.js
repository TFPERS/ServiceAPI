const { verifySignUp } = require('../../middlewares')
const controller = require('../../controllers/petition.controller')
const uploadStorage = require('../../config/multer.config')
 
const express = require('express') 
const router = express.Router()

router.post('/form', controller.petitionForm)
router.put('/update/:id', controller.petitionUpdate)
router.get('/', controller.petitionAll)
router.get('/paginate', controller.petitionPaginate)
router.get('/student/:id', controller.petitionByStudentId)
router.get('/downloadRO01',controller.downloadRO01)
router.get('/downloadRO03',controller.downloadRO03)
router.post('/waiverfees', uploadStorage.array("files") , controller.waiverfee)

module.exports = router
