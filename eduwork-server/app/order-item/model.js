const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const orderItemSchema = Schema({
  name: {
    type: String,
    minlength: [5, "Panjang nama makanan minimal 5 karakter"],
    require: [true, "nama harus di isi"],
  },
  price: {
    type: Number,
    default: 0,
  },
  qty: {
    type: Number,
    min: [1, "Minimal qty 1"],
    require: [true, "Qty harus di isi"],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
});

module.exports = model("OrderItem", orderItemSchema);
