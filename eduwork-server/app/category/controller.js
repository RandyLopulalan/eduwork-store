const Category = require("./model");

// POST
const store = async (req, res, next) => {
  try {
    let payload = req.body;
    let category = new Category(payload);
    await category.save();
    return res.json(category);
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
    let category = await Category.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    return res.json(category);
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
    let category = await Category.find();
    return res.json(category);
  } catch (error) {
    next(error);
  }
};

// delete
const deleteData = async (req, res, next) => {
  try {
    let category = await Category.findByIdAndDelete(req.params.id);

    return res.json(category);
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
