const mongoose = require('mongoose');

const bagSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  orderStatus: {
    type: Boolean,
    default: false
  },
  products: [
    {
      PID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
      },
      quantity: {
        type: String,
        default: 1
      }
    }
  ]
});

const bag = mongoose.model('bag', bagSchema);

module.exports = bag;