const request = require('supertest')
const { Rental } = require('../../models/rentalModel')

jest.setTimeout(30000)

describe('/api/rentals', () => {
  let server

  beforeEach(() => {
    server = require('../../index')
  })

  afterEach(async () => {
    await Rental.deleteMany({})
    await server.close()
  })

  describe('GET /', () => {
    it('should return all rentals', async () => {
      await Rental.collection.insertMany(
        [{
          customer: { name: "Obinna Nnamani", phone: "0817000000" },
          movie: { title: "Terminator", dailyRentalRate: 2 }
        },
        {
          customer: { name: "Ogo Nnamani", phone: "0807000000" },
          movie: { title: "Distraction", dailyRentalRate: 3 }
        }]
      )
  
      const res = await request(server).get('/api/rentals')
  
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
      expect(res.body.some(item => item.customer.name === "Obinna Nnamani"))
        .toBeTruthy()      
      expect(res.body.some(item => item.movie.title === "Distraction"))
        .toBeTruthy()      
    })
  })
})