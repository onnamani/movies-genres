const request = require("supertest");
const { Rental } = require("../../models/rentalModel");
const { Customer } = require('../../models/customerModel')
const { Movies } = require('../../models/movieModel')
const { Genre } = require('../../models/genreModel')
const { User } = require('../../models/userModel')

jest.setTimeout(30000);

describe("/api/rentals", () => {
  let server;

  beforeAll(() => {
    server = require("../../index");
  });

  afterAll(async () => {
    await Rental.deleteMany({});
    await server.close();
  });

  describe("GET /", () => {
    it("should return all rentals", async () => {
      await Rental.collection.insertMany([
        {
          customer: { name: "Obinna Nnamani", phone: "0817000000" },
          movie: { title: "Terminator", dailyRentalRate: 2 },
        },
        {
          customer: { name: "Ogo Nnamani", phone: "0807000000" },
          movie: { title: "Distraction", dailyRentalRate: 3 },
        },
      ]);

      const res = await request(server).get("/api/rentals");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(
        res.body.some((item) => item.customer.name === "Obinna Nnamani")
      ).toBeTruthy();
      expect(
        res.body.some((item) => item.movie.title === "Distraction")
      ).toBeTruthy();
    });
  });

  describe("POST /", () => {
    let customer
    let movie
    let token
    let genre

    beforeEach(async () => {
      token = new User().generateAuthToken()
      genre = new Genre({ name: "Action" })
      customer = new Customer({ name: 'Obinna Nnamani', phone: '0817000000' })
      movie = new Movies({ 
        title: 'Game of Thrones', 
        genre: { id: genre._id, name: genre.name }, 
        numberInStock: 10,
        dailyRentalRate: 5 
      })     
    })

    afterEach(async () => {
      await Customer.deleteMany({})
      await Movies.deleteMany({})
    })
    
    it("should return 404 if customer is not found", async () => {
      const res = await request(server)
        .post('/api/rentals/')
        .set('x-auth-token', token)
        .send({customerId: customer._id, movieId: movie._id})

      expect(res.status).toBe(404)
    });

    it("should return 404 if movie is not found", async () => {
      await customer.save()
      const res = await request(server)
        .post('/api/rentals/')
        .set('x-auth-token', token)
        .send({customerId: customer._id, movieId: movie._id})

      expect(res.status).toBe(404)
    });

    it("should return 404 if number of movie in stock is zero", async () => {
      await customer.save()
      movie.numberInStock = 0
      await movie.save()

      const res = await request(server)
        .post('/api/rentals/')
        .set('x-auth-token', token)
        .send({customerId: customer._id, movieId: movie._id})

      expect(res.status).toBe(404)
    });

    it("should return a rental and update movies", async () => {
      await customer.save()      
      await movie.save()

      const res = await request(server)
        .post('/api/rentals/')
        .set('x-auth-token', token)
        .send({customerId: customer._id, movieId: movie._id})
      
      const movieInDb = await Movies.findById(movie._id)

      expect(res.status).toBe(200)
      expect(res.body.ops[0]).toHaveProperty('dateOut')
      expect(res.body.ops[0]).toHaveProperty('_id')
      expect(movieInDb.numberInStock).toBe(movie.numberInStock - 1)
    });
  });
});
