const request = require('supertest')
const { Customer } = require('../../models/customerModel')

jest.setTimeout(30000)

describe('/api/customers', () => {
  let server

  beforeEach(() => {
    server = require('../../index')
  })

  afterEach(async () => {
    await Customer.deleteMany({})
    await server.close()
  })

  describe('GET /', () => {
    it('should return all customers', async () => {
      await Customer.collection.insertMany([
        { name: "Obinna Nnamani", phone: "0817000000"},
        { name: 'Ogochukwu Nnamani', phone: "0817000000" }
      ])

      const res = await request(server).get('/api/customers')

      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
      expect(res.body.some(customer => customer.name === 'Obinna Nnamani')).toBeTruthy()
      expect(res.body.some(customer => customer.name === "Ogochukwu Nnamani")).toBeTruthy()
    })
  })
})