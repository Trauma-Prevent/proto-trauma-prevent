var express = require("express");
const bodyParser = require('body-parser');
var app = express();

app.get("/", (req, res, next) => {
    res.sendFile('index.html', { root: __dirname });
});

app.use('/', express.static(__dirname+'/lib/bootstrap-page'));
app.use('/', express.static(__dirname+'/lib/tetris/build'));


app.use(bodyParser.urlencoded({ extended: true }));

app.get("/page1", (req, res, next) => {
    res.sendFile('pages/form1.html', { root: __dirname });
});

app.post('/page1', (req, res) => {
    console.log('Got body:', req.body);
    res.redirect('/page2')
});

app.get("/page2", (req, res, next) => {
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
    console.log('Got body:', req.body);
    res.redirect('/page3')
});

app.get("/page3", (req, res, next) => {
    res.sendFile('pages/form2.html', { root: __dirname });
});

app.post('/page3', (req, res) => {
    console.log('Got body:', req.body);
    res.redirect('/page4')
});

app.get("/page4", (req, res, next) => {
    res.sendFile('pages/end.html', { root: __dirname });
});

app.listen(80, () => {
 console.log("Server running on port 80");
});
