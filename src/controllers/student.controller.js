const db = require('../models')
const Student = db.student
const config = require('../config/auth.config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')

exports.signup = async (req, res) => {
    try {
        const student = await Student.create({
        id: req.body.id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: bcrypt.hashSync(req.body.password, 8),
        email: req.body.email,
        major: req.body.major,
        faculty: req.body.faculty,
        telephone: req.body.telephone,
    })
        res.send({ message: "User was registered successfully!" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.signin = async (req, res) => {
    try {
        let user
        user = await Student.findOne({ where:{ id: req.body.username } })
        if (!user) user = await Student.findOne({ where:{ email: req.body.username } })
        if (!user) return res.status(404).send({ message: 'Username or Password Wrong' })
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
        if (!passwordIsValid) return res.status(401).send({accessToken: null, message: "Username or Password Wrong"})
        const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 })
        user = await Student.findOne({ where:{ id: user.id }, attributes: { exclude: 'password' } })
        res
        .status(200).send({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            major: user.major,
            faculty: user.faculty,
            telephone: user.telephone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            accessToken: token
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.studentById = async (req, res) => {
    try {
        const studentById = await Student.findOne({ 
            where:{ 
                id: req.params.id
            },
            attributes : { exclude: 'password'}
        })
        if (!studentById) res.status(404).send({ message: 'User not found' })
        console.log(studentById)
        res.status(200).send(studentById)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.studentUpdate = async (req, res) => {
    try {
        const student = await Student.findOne({ where: { id: req.params.id } })
        const firstName = req.body.firstname || student.firstname
        const lastName = req.body.lastname || student.lastname
        const email = req.body.email || student.email
        const telephone = req.body.telephone || ""
        student.set({
            firstname: firstName,
            lastname: lastName,
            email: email,
            telephone: telephone,
        })
        await student.save()
        res.status(200).send({ message: 'แก้ไขเรียบร้อย' })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}