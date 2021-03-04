function cartController() {
    //factory functions returns objects
    return{
        index(req, res) {//same as index:function(){}
        res.render('customers/cart')  
        },
        update(req, res) {//kyuki bera h n ki har request k sath wa cookie ja h jb tk wa valid rhgi to aapni session id rh h yaad uska.fer har rreq. ka session ho jya h ek.
           //for the first time creating cart and adding basic object structure
            if (!req.session.cart) {
                req.session.cart = {//db m session bnaya tha n utha store kranga inna .
                    items: {},//initialising empty object
                    totalQty: 0,
                    totalPrice:0
                } 
            }
            //agr already h cart m kuchh to wo save kr liya aapin.
            let cart = req.session.cart;
                
            //check if item doesn't exist in cart
            if (!cart.items[req.body._id]) {//pizza jo bhejya h aapin uski id to h e pehli t e wo same pizza agr cart m pehli t e agr nhi h to.....
                cart.items[req.body._id] = {//will become like pizzaid:{item:pizzaObject,qty:0};
                    item: req.body,
                    qty:1
                }
                //jitna already cart me h usme ye bhi add kr dyo.
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price;
            } else {
                cart.items[req.body._id].qty += 1;
                cart.totalQty += 1;
                cart.totalPrice += req.body.price;
            }
            return res.json({totalQty:req.session.cart.totalQty})
        }
    }
}

module.exports = cartController;