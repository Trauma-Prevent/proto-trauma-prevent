
const Sequelize = require('sequelize');
//const sequelize = new Sequelize(process.env.DATABASE_URI);
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    //logging: false
})
const users_table = 'users' // Warning : need a 's' at the end!
const form0_table = 'form0s' // Warning : need a 's' at the end!
const form1_table = 'form1s' // Warning : need a 's' at the end!

module.exports = {

    form0 : (data) => {

        let schema = {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false
            }
        }

        for (let key in data) {
            schema[key] = {
                type: Sequelize.STRING,
                allowNull: true
            }
        }

        return sequelize.define(form0_table, schema)

    },
    form1 : (data) => {

        let schema = {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            form0_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false
            }
        }

        for (let key in data) {
            schema[key] = {
                type: Sequelize.STRING,
                allowNull: true
            }
        }

        return sequelize.define(form1_table, schema)

    },
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
