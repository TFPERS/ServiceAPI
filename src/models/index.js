const config = require('../config/db.config')
const env = process.env.NODE_ENV || 'development'
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        port: config.port,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);
const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.student = require("../models/student.model")(sequelize, Sequelize);
db.petition = require("../models/petition.model")(sequelize, Sequelize);
db.agency = require("../models/agency.model")(sequelize, Sequelize);
db.notification = require("../models/notification.model")(sequelize, Sequelize);
db.StudentNotification = require("../models/student_notification.model")(sequelize, Sequelize);

db.agency.hasMany(db.notification)
db.notification.belongsTo(db.agency)
db.student.hasMany(db.petition, { foreignKey: 'studentId' })
db.petition.belongsTo(db.student, { foreignKey: 'studentId' })
db.agency.hasMany(db.petition, { foreignKey: 'agencyId' })
db.petition.belongsTo(db.agency, { foreignKey: 'agencyId' })

db.student.belongsToMany(db.notification, {
    through: db.StudentNotification
})
db.notification.belongsToMany(db.student, {
    through:db.StudentNotification
})

module.exports = db;