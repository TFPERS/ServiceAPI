module.exports = (sequelize, Sequelize) => {
  const Petition = sequelize.define("petitions", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    file: {
      type: Sequelize.STRING,
      allowNull: true,
    }
  });
  return Petition
};