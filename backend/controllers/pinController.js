const Pin = require("../models/Pin");

// Create a new Pin
exports.addPin = async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Get all Pins
exports.getAllPins = async (req, res) => {
  try {
    const allPins = await Pin.find();
    res.status(200).json(allPins);
  } catch (err) {
    res.status(404).json(err);
  }
};

exports.deletePin = async (req, res) => {
  try {
    await Pin.deleteOne({ title: req.params.title });
    res.status(200).json("success");
  } catch (err) {
    res.status(400).json(err);
  }
};
