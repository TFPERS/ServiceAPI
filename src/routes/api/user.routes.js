const { authJwt } = require('../../middlewares')
const controller = require('../../controllers/user.controller')
const express = require('express');
const router = express.Router();

router.get('/all', controller.allAccess)
router.get('/user', [authJwt.verifyToken], controller.userBoard)
router.get('/mod', [authJwt.verifyToken, authJwt.isModerator], controller.moderatorBoard)
router.get('/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard)
router.get('/getAllUser', controller.allUser)

module.exports = router;

// module.exports = function(app) {
//     app.use(function(req, res, next) {
//         res.header(
//             "Access-Control-Allow-Headers",
//             "x-access-token, Origin, Content-Type, Accept"
//         )
//         next()
//     })
//     app.get(
//         "/api/test/user",
//         [authJwt.verifyToken],
//         controller.userBoard
//     )
//     app.get(
//         "/api/test/mod",
//         [authJwt.verifyToken, authJwt.isModerator],
//         controller.moderatorBoard
//       );
//       app.get(
//         "/api/test/admin",
//         [authJwt.verifyToken, authJwt.isAdmin],
//         controller.adminBoard
//       );
// }