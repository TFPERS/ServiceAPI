const db = require('../models')
const Petition = db.petition
const Student = db.student
const Agency = db.agency
const Notification = db.notification
const StudentNotification = db.StudentNotification

exports.notificationEachStudent = async (req, res) => {
    try {
    const studentId = req.params.studentId
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
    res.status(200).send(studentNotification)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.addNotificationByAgencyForAllStudent = async (req, res) => {
    try {
        if (!req.body.description) return res.status(500).send({ message: "Please add description" })
        const {dataValues} = await Notification.create({
            subject: req.body.subject,
            description: req.body.description,
            agencyId: req.body.agencyId
        })
        const lastNotiId = dataValues.id
        // StudentNotification.create({
        //     notificationId: lastNotiId,

        // })
        const studentIdAll = await Student.findAll({
            attributes: { exclude: ['firstname', 'lastname', 'password', 'email','major','faculty','telephone', 'createdAt', 'updatedAt']}
        }) 
        studentIdAll.forEach((std) => {
            StudentNotification.create({
                is_read: 0,
                notificationId: lastNotiId,
                studentId: std.id,
            })
        })
        res.status(200).send({ message: "add notification successfully!" })
        // res.status(200).send(studentId)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.allNotificationForAgency = async (req, res) => {
    try {
        const agencyNoti = await Notification.findAll({
            include: {
                model: Agency,
                attributes: { exclude: ['password']}
            },
            attributes: { exclude: ['agencyId']}
        })
        res.status(200).send(agencyNoti)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}
