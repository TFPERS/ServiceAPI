const { verifySignUp } = require('../../middlewares')
const controller = require('../../controllers/petition.controller')

const express = require('express') 
const router = express.Router()

router.post('/form', controller.petitionForm)
router.get('/', controller.petitionAll)
router.get('/paginate', controller.petitionPaginate)
router.get('/me/:id', controller.petitionById)
router.get('/test',controller.petitionAll)

module.exports = router
