
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URI);
const users_table = 'my_users' // WArning : need a 's' at the end!

module.exports = {

    users : sequelize.define(users_table, {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        salt: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })
}
