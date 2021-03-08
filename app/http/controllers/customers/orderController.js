  
const Order = require('../../../models/order')
const moment = require('moment')
const stripe = require('stripe')(process.env.PRIVATE_STRIPE_KEY)
function orderController () {
     return {
        //*********for saving order in database********* */
        store(req, res) {
            // Validate request
            const { phone, address, stripeToken, paymentType } = req.body
            if(!phone || !address) {
                return res.status(422).json({ message : 'All fields are required' });
            }

            const order = new Order({
                
                customerId: req.user._id,
                //wo bear e h tna global user set krya tha server js m jo current log in user how h wo.
                items: req.session.cart.items,
                 //yo bhi wo e system h global session aala server js m .
                 phone,
                address
            })
             order.save().then(result => {
               //mtlb bhyi hum customerId k basis pr iska pura data chahte h fer hum customerId. krke data access kr skte h
               Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    //due to fact that now we are using ajax for order(for applying payment gateway) so no need of this.
                    // req.flash('success', 'order placed successfully');
                    
                    //stripe payment
                     if(paymentType === 'card') {
                        stripe.charges.create({
                           //we want payment in rupees so it accepts in paise so *100.
                           amount: req.session.cart.totalPrice  * 100,
                            source: stripeToken,
                            currency: 'inr',
                            description: `Pizza order: ${placedOrder._id}`
                        }).then(() => {
                            placedOrder.paymentStatus = true
                            placedOrder.paymentType = paymentType
                            placedOrder.save().then((ord) => {
                                // Emit
                                console.log('saved')
                                const eventEmitter = req.app.get('eventEmitter')
                                eventEmitter.emit('orderPlaced', ord)
                                delete req.session.cart
                                return res.json({ message : 'Payment successful, Order placed successfully' });
                            }).catch((err) => {
                                console.log(err)
                            })

                        }).catch((err) => {
                            delete req.session.cart
                            return res.json({ message : 'OrderPlaced but payment failed, You can pay at delivery time' });
                        })
                    } else {
                        delete req.session.cart
                        return res.json({ message : 'Order placed succesfully' });
                    }
                   
                    //due to fact that now we are using ajax for order(for applying payment gateway
                    // return res.redirect('/customer/orders');
                 })
            }).catch(err =>
            {
                 return res.status(500).json({ message: ' Something Went Wrong!!' })
                 
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
        },
       
       /*******************for show live tracking of order*********************/
       async show(req, res)
        {
           const order = await Order.findById(req.params.id);
           //Authorize User
           if (req.user._id.toString()===order.customerId.toString()) {//kyuki jo mongodb me id how h w object type ki how h(chahe jaake dekh le objectType likh rakhya h) or 2 objects ko hum ase compare nhi kr skte so hme unhe convert krn hoga strings me.//kyuki customer id e to wa h n userId jista sb user linked h.or usse t e to currently logged in user match howga.       
               return res.render('customers/singleorder', { order: order })  
           } else {
               res.redirect('/');
           }

       }
        
    }
}


module.exports = orderController;