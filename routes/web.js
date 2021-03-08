const homeController = require('../app/http/controllers/homeController');
const authController=require('../app/http/controllers/authController')
const cartController=require('../app/http/controllers/customers/cartController')
const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');
const customer = require('../app/http/middlewares/customer');
const orderController = require('../app/http/controllers/customers/orderController')
const AdminOrderController = require('../app/http/controllers/admin/AdminOrderController')
const statusController=require('../app/http/controllers/admin/statusController')

function initRoutes(app) {
    
    app.get('/',customer, homeController().index)//yha hum 2nd param me ek unnamed funcn dete h jisme req and res hote h or hme contoller me res.render k liye res to chahiye na to hmne kya kiya wha se jo funcn aa rha ha uska name yha de diya or fir wha use bhi req,res mil gye.
   
    app.get('/login',guest, authController().logIn)
    app.post('/login',authController().postLogin)
    app.get('/register',guest, authController().register)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)
    app.get('/cart',customer,cartController().index)
    app.post('/update-cart', cartController().update);
  
    //customer routes
     app.post('/orders',auth, orderController().store);
    app.get('/customer/orders', auth, orderController().index);
    app.get('/customer/orders/:id', auth, orderController().show);
    

    //Admin routes
    app.get('/admin/orders', admin, AdminOrderController().index);
    app.post('/admin/order/status', admin, statusController().statusUpdate);


  

}




module.exports = initRoutes;