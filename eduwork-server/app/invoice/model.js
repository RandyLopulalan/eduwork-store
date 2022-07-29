const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const invoiceSchema = Schema(
  {
    sub_total: {
      type: Number,
      required: [true, 'sub_total harus di isi']
    },
    delivery_fee: {
      type: Number,
      required: [true, 'delivery_fee harus di isi']
    },
    delivery_address: {
      provinsi: { type: String, require: [true, "Provinsi harus di isi"] },
      kabupaten: { type: String, require: [true, "Kabupaten harus di isi"] },
      kecamatan: { type: String, require: [true, "Kecamatan harus di isi"] },
      kelurahan: { type: String, require: [true, "Kelurahan harus di isi"] },
      detail: String,
    },
    total: {
      type: Number,
      required: [true, "Total harus di isi"],
    },
    payment_status: {
      type: String,
      enum: ["waiting_payment", "paid"],
      default: "waiting_payment",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);

module.exports = model("Invoice", invoiceSchema);
