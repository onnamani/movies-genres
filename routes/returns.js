const moment = require('moment')
const Joi = require('joi')
const { Rental } = require('../models/rentalModel')
const { Movies } = require('../models/movieModel')
const validateMiddleware = require('../middleware/validateMiddleware')
const auth = require('../middleware/authMiddleware')
const express = require('express')
const router = express.Router()

router.post('/', [auth, validateMiddleware(validate)], async (req, res) => { 
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId)
  
  if(!rental) return res.status(404).send("Rental not found")

  if(rental.dateReturned) return res.status(400).send('Rental already processed')

  rental.dateReturned = new Date()
  const rentalDays = moment().diff(rental.dateOut, 'days')
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate
  await rental.save()

  await Movies.updateOne({ _id: rental.movie._id}, {
    $inc: { numberInStock: 1 }
  })
  
  return res.status(200).send(rental)
})

function validate(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };

  return Joi.validate(req, schema);
}

module.exports = router