const homeController = require('../app/http/controllers/homeController');
const authController=require('../app/http/controllers/authController')
const cartController=require('../app/http/controllers/customers/cartController')


function initRoutes(app) {
    
    app.get('/', homeController().index)//yha hum 2nd param me ek unnamed funcn dete h jisme req and res hote h or hme contoller me res.render k liye res to chahiye na to hmne kya kiya wha se jo funcn aa rha ha uska name yha de diya or fir wha use bhi req,res mil gye.
    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update);
    app.get('/login',authController().logIn)
    app.get('/register',authController().register)
}




module.exports = initRoutes;