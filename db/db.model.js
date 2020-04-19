
const Sequelize = require('sequelize');
//const sequelize = new Sequelize(process.env.DATABASE_URI);
const sequelize = new Sequelize(process.env.HEROKU_DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
    port:     match[4],
    host:     match[3],
    logging:  true //false
})
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
