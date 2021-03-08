const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,//users collection ka relation bna rhe h order collection k saath.
        ref:'User',
        required: true
    },
    items: {
        type: Object,//ye aayega cart se mtlb usma h n apna items naam ka object. wo e.
        required:true
    },
    phone: {
        type: Number,
        required:true
    },
    address: {
        type: String,
        required:true
    },
    paymentType: {
        type: String,
        default:'Cash on Delivery'
    },
    status: { type: String, default: 'order_placed' },
    paymentStatus: {
        type:Boolean,
        default:false
    }

}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema); 

module.exports = Order;