const Order = require('../../../models/order');

function statusController()
{
    return {
        statusUpdate(req,res){
            Order.updateOne({ _id: req.body.orderId }, { status: req.body.status }, (err,data) =>
            {
                if (err) {
                    
                   return res.redirect('/admin/orders') 
                }
                //Emit event
                const eventEmitter=req.app.get('eventEmitter')//jo serverjs m bind krya h n 'app' eventEmitter key k saath  wo aapin req. k uper mil jayya kra usta e bs access krya h
                //emitted an event with changed value so that we can listen it anywhere.
                eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status });
                return res.redirect('/admin/orders')
            })//yo aapi admin.js m t xml request maara ha n usma data bheja ha wo h yo....name attribute aala aapa e server pr receive ho jya h bera e h tna.
        }
    }
}



module.exports = statusController;