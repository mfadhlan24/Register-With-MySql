const ViewController = {

    homePage: (req, res) => {
        res.render('home');
    },

    loginPage: (req, res) => {
        res.render('login');
    },

    registerPage: (req, res) => {
        res.render('register');
    },

    adminPage: (req, res) => {
        res.render('admin');
    }

}

module.exports = { ViewController }
