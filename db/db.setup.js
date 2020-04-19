
const Sequelize = require('sequelize');
//const sequelize = new Sequelize(process.env.DATABASE_URI);
const sequelize = new Sequelize(process.env.HEROKU_DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
    port:     match[4],
    host:     match[3],
    logging:  true //false
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



