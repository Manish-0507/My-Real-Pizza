function admin(req, res, next)
{
    if (req.isAuthenticated() && req.user.role=== 'admin') {
        return res.redirect('/admin/orders')
    }
    else {
        return next();
    }
}
module.exports = admin;