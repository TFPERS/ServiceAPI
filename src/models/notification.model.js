module.exports = (sequelize, Sequelize) => {
    const notification = sequelize.define("notification", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        subject: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    })
return notification
}