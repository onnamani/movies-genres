const validateObjectId = require('../middleware/validateObjectId')
const adminMiddleware = require("../middleware/adminMiddleware");
const asyncMiddleware = require('../middleware/async')
const authMiddleware = require("../middleware/authMiddleware");
const { Genre, validate } = require("../models/genreModel");
const validateMiddleware = require('../middleware/validateMiddleware')
const express = require("express");
const mongoose = require('mongoose')
const router = express.Router();



router.get("/", asyncMiddleware(async (req, res) => {  
  const genres = await Genre.find().sort("name");
  res.send(genres);
}));

router.post("/", [authMiddleware, validateMiddleware(validate)], (req, res) => {
  
  const genre = new Genre({
    name: req.body.name,
  });

  genre
    .save()
    .then((document) => res.send(document))
});

router.put("/:id", [authMiddleware, validateMiddleware(validate)], 
asyncMiddleware(async (req, res) => {
  
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");

  res.send(genre);
}));

router.delete("/:id", [authMiddleware, adminMiddleware], (req, res) => {
  Genre.findByIdAndRemove(req.params.id)
    .then((document) => {
      if (!document)
        return res
          .status(404)
          .send("The genre with the given ID was not found.");
      res.send(document);
    })
});

router.get("/:id", validateObjectId, asyncMiddleware(async (req, res) => {
  
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
}));

module.exports = router;
