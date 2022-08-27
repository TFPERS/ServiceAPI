const db = require('../models')
const Student = db.student
const Petition = db.petition

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
            where: {
                status: 'pending'
            }
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
                status: 'success'
            }
        })
        return res.status(200).send({numberOfRequestSuccess})
    } catch (error) {
        res.status(500).send({ message: err.message })
    }
}
