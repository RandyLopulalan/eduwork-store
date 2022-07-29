const path = require("path");
const fs = require("fs");
const config = require("../config");
const Product = require("./model");
const Category = require("../category/model");
const Tag = require("../tag/model");

// POST
const store = async (req, res, next) => {
  try {
    let payload = req.body;

    // Relasi dengan category
    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });
      if (category) {
        payload = { ...payload, category: category.id };
      } else {
        delete payload.category;
      }
    }

    // Relasi dengan tag
    if (payload.tag && payload.tag.length > 0) {
      let tag = await Tag.find({
        name: { $in: payload.tag },
      });
      if (tag.length) {
        payload = { ...payload, tag: tag.map((tags) => tags._id) };
      } else {
        delete payload.tag;
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/images/products/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          let product = new Product({ ...payload, image_url: filename });
          await product.save();
          return res.json(product);
        } catch (error) {
          fs.unlinkSync(target_path);
          if (error && error.name === "ValidationError") {
            return res.json({
              error: 1,
              message: error.message,
              fields: error.errors,
            });
          }
          next(error);
        }
      });

      src.on("error", async () => {
        next(error);
      });
    } else {
      let product = new Product(payload);
      await product.save();
      return res.json(product);
    }
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }

    next(error);
  }
};

// PUT
const update = async (req, res, next) => {
  try {
    let payload = req.body;
    let { id } = req.params;

    // Relasi dengan category
    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });
      if (category) {
        payload = { ...payload, category: category.id };
      } else {
        delete payload.category;
      }
    }

    // Relasi dengan tag
    if (payload.tag && payload.tag.length > 0) {
      let tag = await Tag.find({
        name: { $in: payload.tag },
      });
      if (tag.length) {
        payload = { ...payload, tag: tag.map(tags => tags._id)};
      } else {
        delete payload.tag;
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/images/products/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          let product = await Product.findById(id);
          let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          product = await Product.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
          });
          return res.json(product);
        } catch (error) {
          fs.unlinkSync(target_path);
          if (error && error.name === "ValidationError") {
            return res.json({
              error: 1,
              message: error.message,
              fields: error.errors,
            });
          }
          next(error);
        }
      });

      src.on("error", async () => {
        next(error);
      });
    } else {
      let product = await Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
      return res.json(product);
    }
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }

    next(error);
  }
};

// GET
const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 50, q = "", category = "", tag = [] } = req.query;

    let criteria = {};

    if (q.length) {
      criteria = {
        ...criteria,
        name: { $regex: `${q}`, $options: "i" },
      };
    }

    if (category.length) {
      let categoryResult = await Category.findOne({
        name: { $regex: `${category}`, $options: "i" },
      });

      if (categoryResult) {
        criteria = {
          ...criteria,
          category: categoryResult._id,
        };
      }
    }

    if (tag.length) {
      let tagResult = await Tag.find({ name: { $in: tag } });
      console.log(tag);
      if (tagResult.length > 0) {
        criteria = {
          ...criteria,
          tag: { $in: tagResult.map((tags) => tags._id) },
        };
      }
    }

    let count = await Product.find().countDocuments()

    let product = await Product.find(criteria)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("category")
      .populate("tag");
    return res.json({
      data: product,
      count
    });
  } catch (error) {
    next(error);
  }
};

// delete
const deleteData = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    product = await Product.findByIdAndDelete(req.params.id);

    return res.json(product);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  store,
  update,
  index,
  deleteData,
};
