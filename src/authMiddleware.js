const authMiddleware = {
    authLogin: (req, res, next) => {
        console.log('authLogin Middleware:', req.session);
        if (req.session.login) {
            console.log('User is logged in:', req.session.username);
            return next();
        }
        console.log('User is not logged in');
        return res.redirect('/');
    },

    public: (req, res, next) => {
        console.log('public Middleware:', req.session);
        if (!req.session.login) {
            return next();
        }
        return res.redirect('/admin');
    }
}

module.exports = { authMiddleware }
