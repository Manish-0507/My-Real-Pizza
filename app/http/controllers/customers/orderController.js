const Order = require('../../../models/order');
const moment=require('moment')

function orderController()
{
    return {
        //*********for saving order in database********* */
        store(req,res)
        {
            const { phone, address } = req.body;
            if (!phone || !address) {
                req.flash('error', 'All fields are required!!');
                return res.redirect('/cart')
            }
            const order = new Order({
                customerId: req.user._id,//wo bear e h tna global user set krya tha server js m jo current log in user how h wo.
                 items:req.session.cart.items,//yo bhi wo e system h global session aala server js m .
                phone,
                address
            })
            order.save().then(result =>
            {
                req.flash('success', 'order placed successfully');
                delete req.session.cart
                return res.redirect('/customer/orders');
            }).catch(err =>
            {
                req.flash('error', 'Something went wrong!');
                return res.redirect('/cart');  
            })
        },
        //*******for showing all orders of customer******* */
       async index(req,res)
        {
           const orders = await Order.find({ customerId: req.user._id },
               null,
               { sort: {'createdAt':-1} })//descending order...new comes first in orders table//fetching orders of currently logged in user
           res.header('Cache-Control','no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0')//yo isliye h ki cache na rh kyuki jistra order place krde e jo success mesg aaw h n ust back jaake fer us page pr aawa to fer aa jya h wo....wo na chahiye aapin.
           res.render('customers/orders', {
               orders: orders,
               moment:moment//library for managing date formats
            })
       }
        
    }
}


module.exports = orderController;