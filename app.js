const express = require('express');
const session = require('express-session');
const path = require("path");
const app = express();
const GenerateReport = require("./routes/generateReport");

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'MMMMMMMM',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (1825 * 86400 * 1000),
        httpOnly: false
    }
}));




app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, build, 'index.html'));
});

new GenerateReport(app);

const port = process.env.port || 5000;
app.listen(port, () => console.log("Running on port 5000"))
