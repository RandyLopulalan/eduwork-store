const CartItem = require("../cart-item/model");
const Product = require("../product/model");


// PUT
const update = async (req, res, next) => {
  try {
    let item  = req.body;
    const productId = item.map((items) => items.product._id);
    const product = await Product.find({ _id: { $in: productId } });
    const cartItem = item.map((items) => {
      const relatedProduct = product.find(
        (products) => products._id.toString() === items.product._id
        );
      return {
        product: relatedProduct._id,
        price: relatedProduct.price,
        image_url: relatedProduct.image_url,
        name: relatedProduct.name,
        user: req.user._id,
        qty: items.qty,
      };
    });

    await CartItem.deleteMany({ user: req.user._id });

    await CartItem.bulkWrite(
      cartItem.map((item) => {
        return {
          updateOne: {
            filter: {
              user: req.user._id,
              product: item.product,
            },
            update: item,
            upsert: true,
          },
        };
      })
    );

    return res.json(cartItem);
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
    let item = await CartItem.find({ user: req.user._id }).populate("product");

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  update,
  index,
};
