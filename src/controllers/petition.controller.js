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

exports.petitionPaginate = async (req, res) => {
    try {
        const pageAsNumber = Number.parseInt(req.query.page)
        const sizeAsNumber = Number.parseInt(req.query.size)

        let page = 0;
        if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
            page = pageAsNumber
        }
        let size = 10
        if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
            size = sizeAsNumber
        }
        
        const petition = await Petition.findAndCountAll({
            include: [{
                model: Student,
                attributes: { exclude: 'password' }
            }, {
                model: Agency
            }],
            attributes: { exclude: ['studentId', 'agencyId'] },
            limit: size,
            offset: page * size
        })
        return res.status(200).send(petition)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.petitionById = async (req, res) => {
    try {
        const pageAsNumber = Number.parseInt(req.query.page)
        const sizeAsNumber = Number.parseInt(req.query.size)
        let page = 0;
        if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
            page = pageAsNumber
        }
        let size = 10
        if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
            size = sizeAsNumber
        }
        const petitionById = await Petition.findAndCountAll({
            where: {
                studentId: req.params.id
            },
            include: [{
                model: Student,
                attributes: { exclude: 'password' }
            }, {
                model: Agency
            }],
            attributes: { exclude: ['studentId', 'agencyId'] },
            limit: size,
            offset: page * size
        })
        res.status(200).send({
            content: petitionById.rows,
            totalPages: Math.ceil(petitionById.count / size)
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}