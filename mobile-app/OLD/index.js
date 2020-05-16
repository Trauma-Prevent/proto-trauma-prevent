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
app.use('/', express.static(__dirname+'/lib/carhartl-jquery-cookie-92b7715'));
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
        const user = {email: email, form0: -1, form1: -1};
        authTokens[authToken] = user;
        // Setting the auth token in cookies
        res.cookie('AuthToken', authToken);
        // Redirect user to the protected page
        res.status(200).redirect('/page0');
    }, () => {
        res.status(400).sendFile('pages/login.html', { root: __dirname });
        // FIX ME : need pug-boostrap or ejs (or similar)
        //res.render('login', {
        //    message: 'Invalid username or password',
        //    messageClass: 'alert-danger'
        //});
    });
})

app.get("/privacy", (req, res, next) => {
    if(!req.user) {
        res.status(401).redirect("/login");
    } else {
        res.status(200).sendFile('pages/privacy.html', { root: __dirname });
    }
});

app.get("/page0", (req, res, next) => {
    if(!req.user) {
        res.status(401).redirect("/login");
    } else {
        //res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
        //res.setHeader("Pragma", "no-cache")
        //res.setHeader("Expires", "0")
        res.status(200).sendFile('pages/form0.html', { root: __dirname });
    }
});

app.post('/page0', (req, res) => {
    if(!req.user) {
        res.status(401).redirect("/login");
    } else {

        pass = true 

        //make pass false
        if (req.body['age'] < 18)
            pass = !pass

        else if (req.body['suicidal'] != "0")
            pass = !pass

        else if (req.body['followsup'] != "0")
            pass = !pass

        else if (req.body['physfamiltrauma'] != "0")
            pass = !pass

        else if (req.body['privacy'] != "on")
            pass = !pass

        console.log(req.body)
        console.log(pass)
        if (pass) {

            db.saveForm0(req.user.email, req.body)
                .then((form0_id) => {
                    res.clearCookie('data');
                    req.user.form0 = form0_id
                    res.status(200).redirect('/page1')
                }, () => {
                    res.status(400).redirect('/page0') //stay the same but ensure reload (then people know something wrong happened)
                });

        } else {
            res.clearCookie('data');
            file = 'pages/tau.html'
            res.status(200).sendFile(file, { root: __dirname });
        }
    }
});


app.get("/page1", (req, res, next) => {
    if(!req.user) {
        res.status(401).redirect("/login");
    } else {
        //res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
        //res.setHeader("Pragma", "no-cache")
        //res.setHeader("Expires", "0")
        res.status(200).sendFile('pages/form1.html', { root: __dirname });
    }
});

app.post('/page1', (req, res) => {
    if(!req.user) {
        res.status(401).redirect("/login");
    } else {
        db.saveForm1(req.user.form0, req.body)
            .then((form1_id) => {
                res.clearCookie('data');
                req.user.form01 = form1_id
                res.status(200).redirect('/page2')
            }, () => {
                res.status(400).redirect('/page1') //stay the same but ensure reload (then people know something wrong happened)
            });
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
