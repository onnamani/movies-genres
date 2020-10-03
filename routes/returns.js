const { Rental } = require('../models/rentalModel')
const auth = require('../middleware/authMiddleware')
const express = require('express')
const router = express.Router()

router.post('/', auth, async (req, res) => {
  if (!req.body.customerId) return res.status(400).send('customerId not found')
  if (!req.body.movieId) return res.status(400).send('movieId not found')

  let rental = await Rental.findOne({
    'customer._id': req.body.customerId,
    'movie._id': req.body.movieId
  })
  if(!rental) return res.status(404).send("Rental not found")

  if(rental.dateReturned) return res.status(400).send('Rental already processed')

  rental.dateReturned = new Date()
  rental = await rental.save()
  return res.status(200).send(rental)
})

module.exports = router