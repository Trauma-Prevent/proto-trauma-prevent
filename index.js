const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const db = require('./db/db.js')

const app = express();
const port = process.env.PORT || 80

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

const authTokens = {};


app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get("/", (req, res, next) => { // should stay here in current state
    res.status(200).sendFile('index.html', { root: __dirname });
});

app.use('/static/', express.static(__dirname+'/static'));
app.use('/', express.static(__dirname+'/lib/bootstrap-page'));
app.use('/', express.static(__dirname+'/lib/tetris/build'));
app.use(bodyParser.urlencoded({ extended: true }));
// To parse cookies from the HTTP Request
app.use(cookieParser());

app.use((req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];

    // Inject the user to the request
    req.user = authToken ? authTokens[authToken] : undefined;

    next();
});

app.get("/login", (req, res) =>{
    res.status(200).sendFile('pages/login.html', { root: __dirname });
})

app.get("/register", (req, res) =>{
    res.status(200).sendFile('pages/register.html', { root: __dirname });
})

app.post("/register", (req, res) =>{
    const { email, password } = req.body
    db.createUser(email, password)
    .then(() => {
        res.status(200).sendFile('pages/login.html', { root: __dirname });
    }, () => {
        res.status(400).sendFile('pages/register.html', { root: __dirname });
    });
});

app.post("/login", (req, res) =>{
    const { email, password } = req.body;

    db.verifyUser(email, password)
    .then(() => {
        const authToken = generateAuthToken();
        // Store authentication token
        const user = {email: email};
        authTokens[authToken] = user;
        // Setting the auth token in cookies
        res.cookie('AuthToken', authToken);
        // Redirect user to the protected page
        res.status(200).redirect('/page1');
    }, () => {
        res.status(400).sendFile('pages/login.html', { root: __dirname });
        // FIX ME : need pug-boostrap or ejs (or similar)
        //res.render('login', {
        //    message: 'Invalid username or password',
        //    messageClass: 'alert-danger'
        //});
    });
})

app.get("/page1", (req, res, next) => {
    if(!req.user) {
        res.status(401).redirect("/register");
    } else {
        res.status(200).sendFile('pages/form1.html', { root: __dirname });
    }
});

app.post('/page1', (req, res) => {
    if(!req.user) {
        res.status(401).redirect("/register");
    } else {
        res.status(200).redirect('/page2')
    }
});

app.get("/page2", (req, res, next) => {
    if(!req.user) {
        res.status(401).redirect("/login");
    } else {
        let rand = Math.floor(Math.random() * (2 - 0 + 1));
        let file = 'Error'
        switch(rand) {
            case 0:
                file = 'pages/support.html'
                break
            case 1:
                file = 'pages/tau.html'
                break
            default:
                file = 'pages/tetris.html'
                break
        }
        res.status(200).sendFile(file, { root: __dirname });
    }
});

app.post('/page2', (req, res) => {
    if(!req.user) {
        res.status(401).redirect("/login");
    } else {
        res.status(200).redirect('/page3')
    }
});

app.get("/page3", (req, res, next) => {
    if(!req.user) {
        res.status(401).redirect("/login");
    } else {
        res.status(200).sendFile('pages/form2.html', { root: __dirname });
    }
});

app.post('/page3', (req, res) => {
    if(!req.user) {
        res.status(401).redirect("/login");
    } else {
        res.status(200).redirect('/page4')
    }
});

app.get("/page4", (req, res, next) => {
    if(!req.user) {
        res.status(401).redirect("/login");
    } else {
        res.status(200).sendFile('pages/end.html', { root: __dirname });
    }
});

app.listen(port, () => {
    console.log("Server running on port " + port);
});
