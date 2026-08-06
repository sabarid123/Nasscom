const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema(
  {
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    averagePrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    holdings: [holdingSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
