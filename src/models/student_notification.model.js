module.exports = (sequelize, Sequelize) => {
    const StudentNotification = sequelize.define("student_notification", {
        // id: {
        //     type: Sequelize.INTEGER,
        //     primaryKey: true,
        //     autoIncrement: true,
        //     allowNull: false
        //   },
        is_read: {
          type: Sequelize.BOOLEAN,
          default: false
        }
    });
    return StudentNotification
  };