const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const invoiceSchema = Schema(
  {
    sub_total: {
      type: String,
      enum: ["waiting_payment", "processing", "in_delivery", "delivered"],
      default: "waiting_payment",
    },
    delivery_fee: {
      type: Number,
      default: 0,
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
    Payment_status: {
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
