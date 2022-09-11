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
            customValidator(value) {
                if (value === '') {
                    throw new Error("โปรดใส่ชื่อผู้ใช้หน่วยงาน")
                }
            },
            notNull: {
                msg: 'โปรดใส่ชื่อผู้ใช้หน่วยงาน'
            }
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                msg: 'ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว',
                fields: ['username']
            },
            validate: {
                customValidator(value) {
                    if (value === '') {
                        throw new Error("โปรดใส่ชื่อผู้ใช้")
                    }
                },
                notNull: {
                    msg: 'โปรดใส่ชื่อผู้ใช้'
                },
            },
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            customValidator(value) {
                if (value === '') {
                    throw new Error("โปรดใส่รหัสผ่าน")
                }
            },
            notNull: {
                msg: 'โปรดใส่รหัสผ่าน'
            }
        },
    });
return Agency
}