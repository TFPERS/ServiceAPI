const db = require('../models')
const Petition = db.petition
const Student = db.student
const Agency = db.agency
const Notification = db.notification
const StudentNotification = db.StudentNotification

exports.notificationEachStudent = async (req, res) => {
    try {
    const studentId = req.params.studentId
    console.log(`studentId`, studentId)
    const studentNotification = await StudentNotification.findAll({
        where: {studentId: studentId},
        include: {
            model: Notification,
            attributes: { exclude: ['createdAt', 'updatedAt', 'agencyId'] },
            include: {
                model: Agency,
                attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
            }
        },
        attributes: {exclude: ['notificationId']},
    })
    const isRead = studentNotification.every((noti) => {
        return noti.is_read === true
    })
    res.send({
        isRead: isRead,
        studentNotification
    })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.notificationReadingAlready = async (req, res) => {
    try {
        const studentId = req.params.studentId
        StudentNotification.update(
            { is_read: 1},
            { where: { studentId: studentId}}
        )
        res.status(200).send({ message: 'Update success' })
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
