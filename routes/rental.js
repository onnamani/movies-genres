const { Rental: Rentals, validate } = require("../models/rentalModel");
const { Customer } = require("../models/customerModel");
const { Movies } = require("../models/movieModel");
const asyncMiddleware = require('../middleware/async')
const authMiddleware = require('../middleware/authMiddleware')
const validateMiddleware = require('../middleware/validateMiddleware')
const validateObjectId = require('../middleware/validateObjectId')
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);

router.get("/", asyncMiddleware(async (req, res) => {
  const rentals = await Rentals.find().sort("customer");
  res.send(rentals);
}));

router.post("/", [authMiddleware, validateMiddleware(validate)], 
async (req, res) => {  
  try {
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send("Customer does not exist");

    const movie = await Movies.findById(req.body.movieId);
    if (!movie) return res.status(404).send("Movie does not exist");

    if (movie.numberInStock === 0)
      return res.status(404).send("Movie not available");

    let rental = new Rentals({
      customer: {
        _id: customer._id,
        name: customer.name,
        isGold: customer.isGold,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    try {
      new Fawn.Task()
        .save("rentals", rental)
        .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
        .run();

      res.send(rental);
    } catch (err) {
      res.status(500).send("Something failed..");
    }
  } catch (customerMovieErr) {
    res.status(400).send(customerMovieErr.message);
  }
});

module.exports = router;
