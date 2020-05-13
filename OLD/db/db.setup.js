
const Sequelize = require('sequelize');
//const sequelize = new Sequelize(process.env.DATABASE_URI);
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres'
})
const model = require('./db.model')

sequelize
    .authenticate()
    .then(() => {
        const Users = model.users
        Users.sync({ alter: true })
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });



