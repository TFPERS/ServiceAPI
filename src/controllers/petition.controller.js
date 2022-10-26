const db = require('../models')
const Petition = db.petition
const Student = db.student
const Agency = db.agency
const config = require('../config/auth.config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const FileDb = db.file
const path = require('path')

exports.petitionForm = async (req, res) => {
    try {
    if (!req.body.description) return res.status(500).send({ message: "Please add description" })
    const petition = await Petition.create({
        type: req.body.type,
        status: req.body.status,
        description: req.body.description,
        note: req.body.note,
        studentId: req.body.studentId,
        term: req.body.term
    })
    res.send({ message: "add was registered successfully!" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.petitionUpdate = async (req, res) => {
    console.log(req.body.note)
    try {
        const petitionId = Number.parseInt(req.params.id)
        const status = req.body.status
        const note = req.body.note
        Petition.update(
            { 
              status: status,
              note: note
            },
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
            },{
                model: FileDb
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
                    {
                        term: {
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
            }, {
                model: FileDb
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
                        {
                            term: {
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

exports.downloadRO01 = async (req, res) => {
    try {
      res.download(path.resolve('Files', 'RO-01.pdf'), (err) => {
        if(err) {
            console.log(err)
        }
      })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}
exports.downloadRO03 = async (req, res) => {
    try {
      res.download(path.resolve('Files', 'RO-03.pdf'), (err) => {
        if(err) {
            console.log(err)
        }
      })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.waiverfee = async (req,res) => {
    try {
        const { type, status, description, studentId, term } = JSON.parse(req.body.data)
        const petition = await Petition.create({
            type: type,
            status: status,
            description: description,
            studentId: studentId,
            note: '',
            term: term
        })
        for(let i = 0; i < req.files.length; i++) {
            const originalName = req.files[i].originalname
            FileDb.create({
                name: req.files[i].filename,
                originalName: originalName.split(" ").join(""),
                petitionId: petition.id
            })
        }
    res.send({ message: "add was registered successfully!" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}