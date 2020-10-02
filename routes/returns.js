const { Rental } = require('../models/rentalModel')
const auth = require('../middleware/authMiddleware')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  if (!req.body.customerId) return res.status(400).send('customerId not found')
  if (!req.body.movieId) return res.status(400).send('movieId not found')

  const rental = await Rental.findOne({
    'customer._id': req.body.customerId,
    'movie._id': req.body.movieId
  })
  if(!rental) return res.status(404).send("Rental not found")

  if(rental.dateReturned) return res.status(400).send('Rental already processed')

  res.status(401).send('Bad Request')
})

module.exports = router