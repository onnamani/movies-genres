const mongoose = require('mongoose')
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
  
  describe('GET /:id', () => {    
    it('should return 400 if customer id is invalid', async () => {
      const res = await request(server).get('/api/customers/1')
      
      expect(res.status).toBe(400)
    })
    
    it('should return a customer if customer id is valid', async () => {
      const customer = new Customer({ name: 'Obinna Nnamani', phone: "08170000000" })
      await customer.save()
  
      const res = await request(server).get('/api/customers/' + customer._id)
  
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name', customer.name)
    })
  
  })
})