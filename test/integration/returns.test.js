const moment = require('moment')
const request = require("supertest");
const { Rental } = require("../../models/rentalModel");
const { User } = require("../../models/userModel");
const { Movies } = require('../../models/movieModel')
const mongoose = require("mongoose");

jest.setTimeout(30000);

describe("POST /api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let movie;
  let rental;
  let token;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movies({
      _id: movieId,
      title: "Terminator",
      dailyRentalRate: 2,
      genre: { name: 'Action' },
      numberInStock: 10
    })
    await movie.save()

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "Obinna Nnamani",
        phone: "08030000000",
      },
      movie: {
        _id: movieId,
        title: "Terminator",
        dailyRentalRate: 2,
      },
    });

    await rental.save();
  });

  afterEach(async () => {
    await Rental.deleteMany({});
    await Movies.deleteMany({})
    await server.close();
  });

  //Return 401 if client is not logged in
  it("should return 401 if client is not logged in", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  // Return 400 if customerId is not provided
  it("should return 400 if customerId is not provided", async () => {
    customerId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  // Return 400 if movieId is not provided
  it("should return 400 if movieId is not provided", async () => {
    movieId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  // Return 404 if no rental found for customer/movie combination
  it("should return 404 if no rental found for customer/movie", async () => {
    await Rental.deleteMany({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  // Return 400 if return already processed
  it("should return 400 if return already processed", async () => {
    await Rental.findByIdAndUpdate(rental._id, { dateReturned: Date.now() });

    const res = await exec();

    expect(res.status).toBe(400);
  });

  // Return 200 if valid request
  it("should return 200 if valid request", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  // Set the return date
  it("should set the return date if input is valid", async () => {
    await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;

    expect(diff).toBeLessThan(5 * 1000);
  });

  // Calculate the rental fee
  it("should set the rental fee if input is valid", async () => {
    rental.dateOut = moment().add(-7, 'days').toDate()
    await rental.save()

    await exec();

    const rentalInDb = await Rental.findById(rental._id);
    
    expect(rentalInDb.rentalFee).toBe(14)
  });

  // Increase the movie stock
  it("should increase the movie stock if input is valid", async () => {
    await exec();

    const movieInDb = await Movies.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1)
  });
});
