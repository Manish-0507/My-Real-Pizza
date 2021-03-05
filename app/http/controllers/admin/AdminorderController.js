const Order = require('../../../models/order');

function orderController()
{
    return {
        index(req,res)
        {
            //ab hum kisi ek customer ke orders nhi laa rhe balki admin k liye db se wo sbhi orders la rhe h jo complete nhi hue h .
            Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 } })
                .populate('customerId', '-password').exec((err,orders) =>
                {
                    if (req.xhr) {
                       return res.json(orders)//yo isliye h bhai kyuki admin.ja m to aapi same url pr request bheja ha to utha khatr aapin page render koni chahiye sirf data chahiye jo utha bnya bnaya page m bhar dyaa.
                    }
                    //or yo isliye h kde koi sidha is url pr jaake load kr le to yo page bhi render hona chahiye n.
                    res.render('admin/orders')
                });//populate mtlb hmne orders se id link ki thi user ki to ye kh rha h ki hme id nhi chahiye bs blki pura wo user chahiye.ans -password ka mtlb h ki hmw password field nhi chahiye.
        }
    }
}

module.exports = orderController;