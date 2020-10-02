const { Rental } = require('../../models/rentalModel')
const mongoose = require('mongoose')


describe('/api/returns', () => {
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
    server.close()
    await Rental.deleteMany({})
  })

  it('should work', async () => {
    const result = await Rental.findById(rental._id)
    expect(result).not.toBeNull()
  })
})