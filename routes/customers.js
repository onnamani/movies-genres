const { Customer, validate } = require('../models/customerModel')
const asyncMiddleware = require('../middleware/async')
const authMiddleware = require('../middleware/authMiddleware')
const express = require("express");
const validateMiddleware = require('../middleware/validateMiddleware');
const validateObjectId = require('../middleware/validateObjectId')
const router = express.Router();



router.get("/", asyncMiddleware(async (req, res) => {
  const customers = await Customer.find().sort({ name: 1 })
  res.send(customers)    
}));

router.post("/", [authMiddleware, validateMiddleware(validate)], (req, res) => {
  
  const customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });

  customer
    .save()
    .then((document) => res.send(document))
});

router.put("/:id", [authMiddleware, validateObjectId, validateMiddleware(validate)], (req, res) => {  
  Customer.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone,
      },
    },
    { new: true }
  )
    .then((document) => {
      if (!document)return res.status(404).send("The Customer with the given ID was not found.");
      res.send(document);
    })
});

router.get('/:id', validateObjectId, (req, res) => {
  Customer.findById(req.params.id)
    .then(document => {
      if (!document) return res.status(404).send("The Customer with the given ID was not found.")
      res.send(document)
    })
})

router.delete('/:id', (req, res) => {
  Customer.findByIdAndDelete(req.params.id)
    .then(document => {
      if (!document) return res.status(404).send("The Customer with the given ID was not found.")
      res.send(document)
    })
    .catch(err => res.send(err.message))
})



module.exports = router;
