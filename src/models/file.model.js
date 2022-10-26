module.exports = (sequelize, Sequelize) => {
    const file = sequelize.define("file", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        originalName: {
            type: Sequelize.STRING,
        },
    })
return file
}