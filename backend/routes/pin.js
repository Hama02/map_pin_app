const router = require("express").Router();
const pinController = require("../controllers/pinController");

router.route("/").post(pinController.addPin).get(pinController.getAllPins);

router.route("/:title").delete(pinController.deletePin);

module.exports = router;
