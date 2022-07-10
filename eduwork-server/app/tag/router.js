const router = require("express").Router();
const { policy_check } = require("../../middleware");
const tagController = require("./controller");

router.get("/tag", tagController.index);

router.post("/tag", policy_check("create", "Tag"), tagController.store);

router.put("/tag/:id", policy_check("update", "Tag"), tagController.update);

router.delete(
  "/tag/:id",
  policy_check("delete", "Tag"),
  tagController.deleteData
);

module.exports = router;
