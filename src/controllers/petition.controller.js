const db = require('../models')
const Petition = db.petition
const Student = db.student
const Agency = db.agency
const config = require('../config/auth.config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.petitionForm = async (req, res) => {
    try {
    if (!req.body.description) return res.status(500).send({ message: "Please add description" })
    const petition = await Petition.create({
        type: req.body.type,
        status: req.body.status,
        description: req.body.description,
        studentId: req.body.studentId
    })
    res.send({ message: "add was registered successfully!" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.petitionAll = async (req, res) => {
    try {
        const allPetition = await Petition.findAll({ 
                include: [{
                    model: Student,
                    attributes: { exclude: 'password' }
                }, {
                    model: Agency
                }],
                attributes: { exclude: ['studentId', 'agencyId'] }
            },
        )
        return res.status(200).send(allPetition)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.petitionById = async (req, res) => {
    try {
        const petitionById = await Petition.findAll({
            where: {
                studentId: req.params.id
            },
            include: [{
                model: Student,
                attributes: { exclude: 'password' }
            }, {
                model: Agency
            }],
            attributes: { exclude: ['studentId', 'agencyId'] }
        })
        res.status(200).send(petitionById)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}