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

checkFieldIsEmpty = (req, res, next) => {
    if (req.body.firstname === "") {
        res.status(500).send({ message: "Please fill firstname" })
        return
    }
    if (req.body.lastname === "") {
        res.status(500).send({ message: "Please fill lastname" })
        return
    }
    if (req.body.email === "") {
        res.status(500).send({ message: "Please fill email" })
        return
    }
    if (req.body.major === "") {
        res.status(500).send({ message: "Please fill major" })
        return
    }
    if (req.body.faculty === "") {
        res.status(500).send({ message: "Please fill faculty" })
        return
    }
    // if (req.body.telephone === "") {
    //     res.status(500).send({ message: "Please fill telephone" })
    //     return
    // }
    next()
}

const verifyEditUser = {
    checkEmailExists,
    checkFieldIsEmpty
}
module.exports = verifyEditUser