const db = require('../models')
const Student = db.student
const config = require('../config/auth.config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const sgMail = require('../config/sgMail.config')

const JWT_SECRET = "hvdvay6ert72830289()aiyg8t87qt72393293883uhe"

exports.signinGoogle = async (req,res) => {
    try {
        const {email} = req.body
        const student = await Student.findOne({ where:{ email: email }})
        if (!student) return res.status(400).send({message:"โปรดลงทะเบียนก่อนเพื่อเข้าสู่ระบบโดยใช้อีเมล"})
        const token = jwt.sign({ id: student.id }, config.secret, { expiresIn: 86400 })
        const user = await Student.findOne({ where:{ id: student.id }, attributes: { exclude: 'password' } })
        return res
        .status(200).send({
            message: 'เข้าสู่ระบบเรียบร้อย',
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
    } catch (error) {
        return res.status(400).send({ message: error.message })
    }
}

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
        if (!user) return res.status(404).send({accessToken: null, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"})
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
        if (!passwordIsValid) return res.status(401).send({accessToken: null, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"})
        const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 })
        user = await Student.findOne({ where:{ id: user.id }, attributes: { exclude: 'password' } })
        res
        .status(200).send({
            message: 'เข้าสู่ระบบเรียบร้อย',
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

exports.forgotPassword = async(req, res) => {
    try {
        const emailSchema = Joi.object({
            email: Joi.string().email().required().label("Email")
        })
        const {error} = emailSchema.validate(req.body)
        if (req.body.email === "") return res.status(400).send({message: "โปรดใส่อีเมล"})
        if(error) return res.status(400).send({message: error.details[0].message})
        let student = await Student.findOne({where:{ email:req.body.email }})
        if(!student) return res.status(409).send({message: "ไม่มีอีเมลนี้ในระบบ"})
        const secret = JWT_SECRET + student.password
        const token = jwt.sign({email: student.email, id: student.id}, secret, {
            expiresIn: "20m"
        })
        const url = `${process.env.CLIENT_ORIGIN}/password-reset/${student.id}/${token}`
        const msg = {
            to: req.body.email,
            from: process.env.EMAIL,
            subject: 'Link Reset Password TFPERS',
            text: url
        }
        sgMail.send(msg,(err,info) => {
            if(err) {
                console.log(err)
                console.log("Email not sent")
            } else {
                console.log("Email Send Sucess")
            }
        })
        res.status(200).send({message:"ลิ้งรีเซ็ตพาสเวิดถูกส่งไปยังอีเมลของคุณ"})
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"เกิดข้อผิดผลาด"})
    }
}

exports.verifyUrl = async(req, res) => {
    // console.log(req.params)
        const {id,token} = req.params
        const student = await Student.findOne({ id: id })
        if (!student) return res.status(400).send({message: "ไม่มีอีเมลนี้ในระบบ"})
        const secret = JWT_SECRET + student.password
    try {
        const verify = jwt.verify(token, secret)
        res.status(200).send({email:verify.email})
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"Not Verified"})
    }
}

exports.resetPassword = async(req, res) => {
        const {id,token} = req.params
        const {password} = req.body
        if (password === "") return res.status(400).send({message:"โปรดกรอกรหัสผ่าน"})
        if (password.length < 8) return res.status(400).send({message:"โปรดใส่รหัสผ่าน 8 หลักขึ้นไป"})
        const student = await Student.findOne({ id: id })
        if (!student) return res.status(400).send({message: "ไม่มีอีเมลนี้ในระบบ"})
        const secret = JWT_SECRET + student.password
        try {
        const verify = jwt.verify(token, secret)
        const encryptedPassword = await bcrypt.hash(password, 8)
        student.set({
            password: encryptedPassword
        })
        await student.save()
        res.status(200).send({message:"อัพเดตรหัสผ่านเรียบร้อย"})
    } catch (error) {
        console.log(error)
        if (error.message === 'jwt expired') return res.status(500).send({message: 'ลิ้งรีเซ็ตพาสเวิดหมดอายุโปรดขอลิ้งใหม่'})
        if (error.message === 'invalid signatureb') return res.status(500).send({message: 'ลิ้งรีเซ็ตพาสเวิดหมดอายุโปรดขอลิ้งใหม่'})
        res.status(500).send({message:error.message})
    }
}