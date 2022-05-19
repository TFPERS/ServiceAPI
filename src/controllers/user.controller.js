const db = require("../models")
const User = db.user
const Student = db.student
const Role = db.role

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.")
}
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.")
}
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.")
}
exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.")
}
exports.allUser = async (req, res) => {
  try {
    const allUser = await Student.findAll()
    res.status(200).send(allUser)
    // const allUser = await User.findAll({ include: { all: true }})
    // const authorities = [];
    // const userWithRole = allUser.map((user) => {
    //   const authorities = []
    //   for (let i=0; i<user.roles.length;i++) {
    //     authorities.push("ROLE_"+ user.roles[i].name.toUpperCase())
    //   }
    //   return {
    //     id: user.id,
    //     username: user.username,
    //     email: user.email,
    //     createdAt: user.createdAt,
    //     updatedAt: user.updatedAt,
    //     roles: authorities
    //   }
    // })
    // res.status(200).send(userWithRole)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}