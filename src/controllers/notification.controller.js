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
        order: [['createdAt', 'DESC']],
        include: {
            model: Notification,
            attributes: { exclude: [ 'updatedAt', 'agencyId'] },
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
    const studentNotification = await StudentNotification.findAll({ order: [['createdAt', 'DESC']],})
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
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['agencyId']},
        })
        res.status(200).send(agencyNoti)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.NotiPaginate = async (req,res) => {
    try {
        const pageAsNumber = Number.parseInt(req.query.page)
        const sizeAsNumber = Number.parseInt(req.query.size)
        const search = req.query.search
        let page = 0;
        if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
            page = pageAsNumber
        }
        let size = 10
        if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
            size = sizeAsNumber
        }

        const noti = await Notification.findAndCountAll({
            include: {
                model: Agency,
                attributes: { exclude: ['password']}
            },
            order: [['createdAt', 'DESC']],
            limit: size,
            offset: page * size,
        })
        return res.status(200).send({
            content: noti.rows,
            totalPages: Math.ceil(noti.count / size)
        })
    } catch (err) {
        
    }
}

exports.deleteNotiById = async (req,res) => {
    try {
        const notiId = req.params.notiId
        Notification.destroy({
            where: {
                id: notiId
            }
        })
        return res.status(200).send({ meesage: 'ลบการแจ้งเตือนนี้เรียบร้อย'})
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.updateDescript = async (req, res) => {
    try {
        const notiId = Number.parseInt(req.params.notiId)
        const descript = req.body.descript
        console.log(descript)
        Notification.update(
            {
                description: descript
            },
            { where: {id: notiId} }
        )
        return res.status(200).send({message: 'แก้ไขการแจ้งเตือนเรียบร้อย' })
    } catch (error) {
        return res.status(500).send({message: error.message})
    }
}