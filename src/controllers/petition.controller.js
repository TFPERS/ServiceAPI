const db = require('../models')
const Petition = db.petition
const Student = db.student
const Agency = db.agency
const config = require('../config/auth.config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

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

exports.petitionUpdateStatus = async (req, res) => {
    try {
        const petitionId = Number.parseInt(req.params.id)
        const status = req.body.status
        Petition.update(
            { status: status },
            { where: {id: petitionId } }
        )
        res.status(200).send({ message: 'Update Status Petition Success' })
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
        const search = req.query.search

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
            offset: page * size,
            where: {
                [Op.or]: [
                    {
                        id: {
                            [Op.like]: `${Number.parseInt(search)}`
                        }
                    }, 
                    {
                        type: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        studentId: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        status: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    // {
                    //     createdAt: search
                    // }
                ]
            },  
        })
        return res.status(200).send({
            content: petition.rows,
            totalPages: Math.ceil(petition.count / size)
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.testFindSearch = async (req, res) => {
    try {
        const pageAsNumber = Number.parseInt(req.query.page)
        const sizeAsNumber = Number.parseInt(req.query.size)
        const search = req.query.search
        console.log("search " +search)

        let page = 0;
        if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
            page = pageAsNumber;
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
            offset: page * size,
            where: {
                [Op.or]: [
                    {
                        type: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        createdAt: {
                            [Op.like]: `%${new Date(search)}`
                        }
                    }
                ]
            },  
        })
        return res.status(200).send({
            content: petition.rows,
            totalPages: Math.ceil(petition.count / size)
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.petitionByStudentId = async (req, res) => {
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
        const petitionById = await Petition.findAndCountAll({
            include: [{
                model: Student,
                attributes: { exclude: 'password' }
            }, {
                model: Agency
            }],
            attributes: { exclude: ['studentId', 'agencyId'] },
            limit: size,
            offset: page * size,
            where: {
                [Op.and]: [
                    { studentId: req.params.id },
                    {[Op.or]: [
                        {
                            id: {
                                [Op.like]: `${Number.parseInt(search)}`
                            }
                        }, 
                        {
                            type: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            studentId: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            status: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        // {
                        //     createdAt: search
                        // }
                    ]}  
                ]
            },  
        })
        res.status(200).send({
            content: petitionById.rows,
            totalPages: Math.ceil(petitionById.count / size)
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}