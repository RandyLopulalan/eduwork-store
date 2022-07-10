const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const deliveryAddressSchema = Schema(
  {
    alamat: {
      type: String,
      maxlength: [255, "Panjang alamat maksimal 255 karakter"],
      require: [true, "Alamat harus di isi"],
    },
    kelurahan: {
      type: String,
      maxlength: [255, "Panjang nama kelurahan maksimal 255 karakter"],
      require: [true, "Kelurahan harus di isi"],
    },
    kecamatan: {
      type: String,
      maxlength: [255, "Panjang nama kecamatan maksimal 255 karakter"],
      require: [true, "Kecamatan harus di isi"],
    },
    kabupaten: {
      type: String,
      maxlength: [255, "Panjang nama kabupaten maksimal 255 karakter"],
      require: [true, "Kabupaten harus di isi"],
    },
    provinsi: {
      type: String,
      maxlength: [255, "Panjang nama provinsi maksimal 255 karakter"],
      require: [true, "Provinsi harus di isi"],
    },
    detail: {
      type: String,
      maxlength: [255, "Panjang detail maksimal 255 karakter"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("DeliveryAddress", deliveryAddressSchema);