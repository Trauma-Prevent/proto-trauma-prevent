const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 80

const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

const authTokens = {};


app.get("/", (req, res, next) => {
    res.sendFile('index.html', { root: __dirname });
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
    res.sendFile('pages/login.html', { root: __dirname });
})

app.post("/login", (req, res) =>{
    const { email, password } = req.body;
    const hashedPassword = getHashedPassword(password);

    // This is just a Stub
    // FIXME: replace this with DB call (using Sequelize)
    const user = {email: email, password: hashedPassword};
    if (user) {
        const authToken = generateAuthToken();


        // Store authentication token
        authTokens[authToken] = user;

        // Setting the auth token in cookies
        res.cookie('AuthToken', authToken);

        // Redirect user to the protected page
        res.redirect('/page1');
    } else {
        res.render('login', {
            message: 'Invalid username or password',
            messageClass: 'alert-danger'
        });
    }
})

app.get("/page1", (req, res, next) => {
    if(!req.user) res.redirect("/login");

    res.sendFile('pages/form1.html', { root: __dirname });
});

app.post('/page1', (req, res) => {
    if(!req.user) res.redirect("/login");

    console.log('Got body:', req.body);
    res.redirect('/page2')
});

app.get("/page2", (req, res, next) => {
    if(!req.user) res.redirect("/login");

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
    res.sendFile(file, { root: __dirname });
});

app.post('/page2', (req, res) => {
    if(!req.user) res.redirect("/login");

    console.log('Got body:', req.body);
    res.redirect('/page3')
});

app.get("/page3", (req, res, next) => {
    if(!req.user) res.redirect("/login");

    res.sendFile('pages/form2.html', { root: __dirname });
});

app.post('/page3', (req, res) => {
    if(!req.user) res.redirect("/login");

    console.log('Got body:', req.body);
    res.redirect('/page4')
});

app.get("/page4", (req, res, next) => {
    if(!req.user) res.redirect("/login");

    res.sendFile('pages/end.html', { root: __dirname });
});

app.listen(port, () => {
    console.log("Server running on port " + port);
});
