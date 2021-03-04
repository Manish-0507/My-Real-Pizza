function authController() {
    return {
        logIn(req,res) {
            res.render('auth/login')
        },
        register(req,res) {
            res.render('auth/register')
        }
    }
}

module.exports = authController;