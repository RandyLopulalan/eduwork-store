const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const tagSchema = Schema(
  {
    name: {
      type: String,
      minlength: [3, "Panjang nama makanan minimal 3 karakter"],
      maxlength: [20, "Panjang nama makanan maksimal 20 karakter"],
      require: [true, "Nama kategory harus di isi"],
    }
  }
);

module.exports = model("Tag", tagSchema);
