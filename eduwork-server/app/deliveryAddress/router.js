const { policy_check } = require("../../middleware");
const router = require("express").Router();

const deliveryAddressController = require("./controller");

router.get(
  "/delivery-address",
  policy_check("view", "DeliveryAddress"),
  deliveryAddressController.index
);

router.post(
  "/delivery-address",
  policy_check("create", "DeliveryAddress"),
  deliveryAddressController.store
);

router.put(
  "/delivery-address/:id",
  deliveryAddressController.update
);

router.delete(
  "/delivery-address/:id",
  deliveryAddressController.deleteData
);

module.exports = router;
