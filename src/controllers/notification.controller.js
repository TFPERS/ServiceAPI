const db = require('../models')
const Petition = db.petition
const Student = db.student
const Agency = db.agency
const Notification = db.notification
const StudentNotification = db.StudentNotification

exports.notificationEachStudent = async (req, res) => {
    try {
    const studentId = Number.parseInt(req.query.studentId)
    const studentNotification = await StudentNotification.find({
        where: {studentId: studentId},
    })
    res.send(studentNotification)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}
exports.notificationAll = async (req, res) => {
    try {
    const studentNotification = await StudentNotification.findAll()
    res.send(studentNotification)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}
