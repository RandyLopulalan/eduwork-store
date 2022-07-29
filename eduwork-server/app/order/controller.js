const CartItem = require("../cart-item/model");
const DeliveryAddress = require("../deliveryAddress/model");
const Order = require("./model");
const OrderItem = require("../order-item/model");
const { Types } = require("mongoose");

// POST
const store = async (req, res, next) => {
  try {
    let { delivery_fee, delivery_address } = req.body;
    let item = await CartItem.find({ user: req.user._id }).populate("product");
    if (!item) {
      return res.json({
        error: 1,
        message: "you are not create order because you have no item in cart",
      });
    }
    let address = await DeliveryAddress.findById(delivery_address);

    let order = new Order({
      _id: new Types.ObjectId(),
      status: "waiting_payment",
      delivery_fee: delivery_fee,
      delivery_address: {
        provinsi: address.provinsi, 
        kabupaten: address.kabupaten,
        kecamatan: address.kecamatan,
        kelurahan: address.kelurahan,
        detail: address.detail,
      },
      user: req.user._id,
    });

    let orderItem = await OrderItem.insertMany(
      item.map((items) => ({
        ...items,
        name: items.product.name,
        qty: parseInt(items.qty),
        price: parseInt(items.product.price),
        order: order._id,
        product: items.product._id,
      }))
    );
    orderItem.forEach((items) => order.order_item.push(items));
    order.save();
    await CartItem.deleteMany({ user: req.user._id });
    return res.json(order);
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
    let { skip = 0, limit = 12 } = req.query;
    let count = await Order.find({ user: req.user._id }).countDocuments();
    let order = await Order.find({ user: req.user._id })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("order_item")
      .sort("-createdAt");
    return res.json({
      data: order.map((orders) => orders.toJSON({ virtuals: true })),
      count,
    });
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

module.exports = {
  store,
  index,
};
