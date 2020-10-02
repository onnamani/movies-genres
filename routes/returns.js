const auth = require('../middleware/authMiddleware')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  if (!req.body.customerId) return res.status(400).send('customerId not found')

  res.status(401).send('Bad Request')
})

module.exports = router