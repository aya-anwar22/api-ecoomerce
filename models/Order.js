const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    items:[
    {
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        quantity:{
            type: Number,
            required: true,
        },
        priceAtOrderTime:{
            type: Number,
            required: true,
        }

    }
    ],
    address: {
    label: { type: String, required: true },
    details: { type: String, required: true }
    },

    status: {
    type: String,
    enum: ['preparing', 'shipped', 'delivered', 'cancelled'],
    default: 'preparing'
  },
  paymentMethod:{
    type:String,
    enum: ['cash'],
    default: 'cash'
  },

  isPaid:{
    type:Boolean,
    default: false
  },
  
    placedAt: {
    type: Date,
    default: Date.now
  },

  deliveredAt: {
    type: Date
  },

  cancellation: {
    isCancelled: { type: Boolean, default: false },
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, enum: ['user', 'admin'], default: null },
    cancelledAt: { type: Date }
  },


  returnRequested: {
    type: Boolean,
    default: false
  },

  returnDeadline: {
    type: Date
  }
}, {
  timestamps: true
});
const Order = mongoose.model('Order', orderSchema);
module.exports = Order