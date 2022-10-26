const db = require('../models')
const ROLES = db.ROLES
const User = db.user
const Student = db.student
checkEmailExists = async(req, res, next) => {
    const student = await Student.findOne({ where: { id: req.params.id } })
    if (student.email === req.body.email) {
        next()
    } else {
        const email = await Student.findOne({ where: { email: req.body.email } })
        if (email) {
            res.status(400).send({ message: "อีเมลนี้มีผู้ใช้แล้ว" })
        }
        next()
    }
}

const verifyPetitionFile = {

}
module.exports = verifyPetitionFile