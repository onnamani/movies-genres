const request = require('supertest')
const { Rental } = require('../../models/rentalModel')
const { User } = require('../../models/userModel')
const mongoose = require('mongoose')

jest.setTimeout(30000)

describe('POST /api/returns', () => {
  let server;
  let customerId
  let movieId
  let rental

  beforeEach(async () => {
    server = require('../../index')

    customerId = mongoose.Types.ObjectId()
    movieId = mongoose.Types.ObjectId()
        
    rental = new Rental({
      customer: {
        _id: customerId,
        name: 'Obinna Nnamani',
        phone: '08030000000'
      },
      movie: {
        _id: movieId,
        title: 'Terminator',
        dailyRentalRate: 2
      }
    })

    await rental.save()
  })

  afterEach(async () => {
    await Rental.deleteMany({})
    await server.close()
  })

  //Return 401 if client is not logged in
  it('should return 401 if client is not logged in', async () => {
    const res = await request(server)
      .post('/api/returns')
      .send({ customerId, movieId })

    expect(res.status).toBe(401)
  })

  // Return 400 if customerId is not provided
  it('should return 400 if customerId is not provided', async () => {
    const token = new User().generateAuthToken()
    const res = await request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ movieId })
    
    expect(res.status).toBe(400)
  })

  // Return 400 if movieId is not provided
  it('should return 400 if movieId is not provided', async() => {
    const token = new User().generateAuthToken()
    const res = await request(server)
      .post('/api/returns/')
      .set('x-auth-token', token)
      .send({ customerId })
  })
})