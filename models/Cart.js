const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },

      quantity: {
        type: Number,
        required: true,
        default:1,
        min: 1
      },

      addedAt: {
        type: Date,
        default: Date.now
      },

      originalPrice: {
        type: Number,
        required: true
      },

      currentPrice: {
        type: Number,
        required: true
      }
    }
  ]
}, {
  timestamps: true 
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart