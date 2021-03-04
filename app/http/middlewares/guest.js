//is middleware t aapi ye check krenge ki user logged in h ya nhi taaki agr wo logged in h to login or register page n wo visit nhi kr ska.
function guest(req, res, next) {
    if (!req.isAuthenticated()) {//ye method possible h passport library k kaaran.
        return next()//agr nhi h logged in to wo next() mtlb jaao aage.
    } else {
        return res.redirect('/');  
    }
    
}


module.exports = guest;