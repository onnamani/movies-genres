const { Customer, validate } = require('../models/customerModel')
const express = require("express");
const router = express.Router();



router.get("/", (req, res) => {
  Customer.find()
    .sort({ name: 1 })
    .then((document) => res.send(document))
    .catch((err) => res.send(err.message));
});

router.post("/", (req, res) => {
  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });

  customer
    .save()
    .then((document) => res.send(document))
    .catch((err) => res.send(err.message));
});

router.put("/:id", (req, res) => {
  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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
    .catch((err) => res.send(err.message));
});

router.get('/:id', (req, res) => {
  Customer.findById(req.params.id)
    .then(document => {
      if (!document) return res.status(404).send("The Customer with the given ID was not found.")
      res.send(document)
    })
    .catch(err => res.send(err.message))
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
