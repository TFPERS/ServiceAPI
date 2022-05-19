module.exports = (sequelize, Sequelize) => {
    const Agency = sequelize.define("agencys", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        noti: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    });
return Agency
}