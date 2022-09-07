const { verifySignUp } = require('../../middlewares')
const controller = require('../../controllers/petition.controller')

const express = require('express') 
const router = express.Router()

router.post('/form', controller.petitionForm)
router.put('/update/status/:id', controller.petitionUpdateStatus)
router.get('/', controller.petitionAll)
router.get('/paginate', controller.petitionPaginate)
router.get('/me/:id', controller.petitionById)
router.get('/test',controller.petitionAll)

module.exports = router
