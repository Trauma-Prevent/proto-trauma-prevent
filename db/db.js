
SALTA=1
const crypto = require('crypto');
const Sequelize = require('sequelize');
// const sequelize = new Sequelize(process.env.DATABASE_URI);
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres'
})
const db = require('./db.model')

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

module.exports = {
    createUser: function(email, clearpassword) {

        function ValidateEmail(email) {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
                return (true)
            }
            return (false)
        }

        return new Promise(function(resolve, reject) {
            sequelize
                .authenticate()
                .then(() => {
                    db.users.count({ where: { email: email } })
                        .then(count => {
                            let user = {}
                            if (ValidateEmail(email) && count == 0) {
                                const buf = crypto.randomBytes(16)
                                const salt = buf.toString('base64')
                                const hashedPassword = getHashedPassword(clearpassword + salt)
                                db.users.create({ email: email, salt: salt, password: hashedPassword }).then((user) => {
                                    if (user.id) {
                                        resolve()
                                    } else {
                                        reject()
                                    }
                                });
                            } else {
                                reject()
                            }
                            //.catch(error => res.status(400).json({error}));;
                        })

                }, {
                    // options
                })
                .catch(err => {
                    reject('Unable to connect to the database');
                    console.error('Unable to connect to the database:', err);
                })
        })
    },
    verifyUser: function(email, clearpassword) {

        return new Promise(function(resolve, reject) {
            sequelize
                .authenticate()
                .then(() => {

                    db.users.findAll({
                        where: {
                            email: email
                        }
                    }).then((results) => {            
                        const user = results[0]
                        if(user) {
                            const hashedPassword = getHashedPassword(clearpassword + user.salt)
                            if (user.password == hashedPassword) {
                                resolve()
                            } else {
                                reject()
                            }
                        } else {
                            reject()
                        }
                    })
                    //.catch(error => res.status(400).json({error}));;
                }, {
                    // options
                })
                .catch(err => {
                    reject();
                    console.error('Unable to connect to the database:', err);
                })
        })
    }
}

