const db = require('../models')
const Student = db.student
const Petition = db.petition
const Agency = db.agency
const config = require('../config/auth.config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const StatusPetition = require('../enum/StatusPetition')

exports.numberOfStudent = async (req,res) => {
    try {
        const numberAllStudent = await Student.count()
        return res.status(200).send({numberAllStudent})
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}
exports.numberOfRequest = async (req, res) => {
    try {
        const numberOfRequestPending = await Petition.count({
        })
        return res.status(200).send({numberOfRequestPending})
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}
exports.numberOfRequestSuccess = async (req, res) => {
    try {
        const numberOfRequestSuccess = await Petition.count({
            where: {
                status: StatusPetition.Done
            }
        })
        return res.status(200).send({numberOfRequestSuccess})
    } catch (error) {
        res.status(500).send({ message: err.message })
    }
}

exports.signup = async (req, res) => {
    try {
        const student = await Agency.create({
        id: req.body.id,
        name: req.body.name,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
    })
        res.send({ message: "Agency was registered successfully!" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}
exports.signIn = async (req, res) => {
    try {
      let agency
      agency = await Agency.findOne({ where: { username: req.body.username }})
      if (!agency) return res.status(404).send({accessToken: null, message: "Username or Password Wrong"})
      const passwordIsValid = bcrypt.compareSync(req.body.password, agency.password)
      if (!passwordIsValid) return res.status(401).send({accessToken: null, message: "Username or Password Wrong"})
      const token = jwt.sign({ id: agency.id }, config.secret, { expiresIn: 86400 })
      agency = await Agency.findOne({ where: {id: agency.id }, attributes: { exclude: 'password' }})
      res.status(200).send({
        message: 'เข้าสู่ระบบเรียบร้อย',
        id: agency.id,
        name: agency.name,
        username: agency.username,
        createdAt: agency.createdAt,
        updatedAt: agency.updatedAt,
        accessToken: token,
        role: 'agency'
      })
    } catch (error) {
        res.status(500).send({ message: err.message })
    }
  }