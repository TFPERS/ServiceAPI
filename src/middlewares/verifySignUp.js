const db = require('../models')
const ROLES = db.ROLES
const User = db.user
const Student = db.student

checkDuplicateUsernameOrEmail = async (req, res, next) => {
    // Username
    const user = User.findOne({ where: { username: req.body.username } })
    if (user) {
        res.status(400).send({ message: "Failed! Username is already in use!" })
        return
      }
    // Email
    const email = User.findOne({ where: { email: req.body.email } })
      if (email) {
        res.status(400).send({ message: "Failed! Email is already in use!" })
        return
      }
    next()
}

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({ message: "Failed! Role does not exist = " + req.body.roles[i] })
        return
      }
    }
  }
  next()
}

checkStudentDuplicateIdOrEmail = async (req, res, next) => {
  let student
  student = await Student.findOne({ where: { id: req.body.id } })
  if (student) {
    res.status(400).send({ message: "Failed! StudentId is already in use!" })
    return
  }
  student = await Student.findOne({ where: { email: req.body.email }})
  if (student) {
    res.status(400).send({ message: "Failed! Email is already in use!" })
    return
  } 
  next()
}

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
  checkStudentDuplicateIdOrEmail
}
module.exports = verifySignUp