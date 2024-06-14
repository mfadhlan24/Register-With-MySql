const express = require('express');
const { ViewController } = require('./src/controller/viewController');
const { UserController } = require('./src/controller/userController');
const { authMiddleware } = require('./src/authMiddleware');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "SECRET-KEY",
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    console.log('Session:', req.session);
    next();
});

// Routes
app.get('/', authMiddleware.public, ViewController.homePage);
app.get('/login', authMiddleware.public, ViewController.loginPage);
app.get('/register', authMiddleware.public, ViewController.registerPage);
app.get('/admin', authMiddleware.authLogin, ViewController.adminPage);


app.post('/login', authMiddleware.public, UserController.login);
app.post('/register', authMiddleware.public, UserController.register);
app.get('/logout', authMiddleware.authLogin, UserController.logout);

app.listen(2024, () => {
    console.log('Server berjalan di port : 2024');
});
