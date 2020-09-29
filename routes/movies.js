const { Movies, validate } = require("../models/movieModel");
const { Genre } = require("../models/genreModel");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  Movies.find()
    .sort("title")
    .then((document) => res.send(document))
    .catch((err) => res.send(err.message));
});

router.post("/", (req, res) => {
  
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log(req.body);


  Genre.findById(req.body.genreId)
    .then(document => {
      if (!document) return res.status(400).send("Invalid genre")

      const movie = new Movies({
        title: req.body.title,
        genre: {
          _id: document._id,
          name: document.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      });
    
      movie
        .save()
        .then((movieDocument) => res.send(movieDocument))
        .catch((movieErr) => res.send(movieErr.message));
    })
    .catch(err => res.send(err.message))

});

router.put("/:id", (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  Genre.findById(req.body.genreId)
    .then(document => {
      if (!document) return res.status(400).send("Invalid genre")

      Movies.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
          _id: document._id,
          name: document.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      }, { new: true })
        .then(movieDocument => res.send(movieDocument))
        .catch(movieErr => res.send(movieErr.message))
    })
    .catch(err => res.send(err.message))

});

router.delete('/:id', (req, res) => {
  Movies.findByIdAndDelete(req.params.id)
    .then(document => {
      if (!document) return res.status(404).send("Movie with given ID not found")
      res.send(document)
    })
    .catch(err => res.send(err.message))
})

router.get('/:id', (req, res) => {
  Movies.findById(req.params.id)
    .then(document => {
      if (!document) return res.status(404).send("Movie with given ID not found")
      res.send(document)
    })
})

module.exports = router;
