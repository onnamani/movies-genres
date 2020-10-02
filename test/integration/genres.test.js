const request = require("supertest");
const { Genre } = require("../../models/genreModel");
const { User } = require("../../models/userModel");
const mongoose = require("mongoose");
let server;

jest.setTimeout(30000);

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await Genre.deleteMany({});
    await server.close();
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });

  describe("GET /:id", () => {
    it("should return a 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(404);
    });
  });

  describe("GET /:id", () => {
    it("should return a 404 if no genre with the given id exists", async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await request(server).get("/api/genres/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    // Define the happy path, and then in each TestScheduler, we change
    // one parameter that clearly aligns with the name of the test

    let token;
    let name;

    beforeEach(() => {
      token = User().generateAuthToken();
      name = "genre1";
    });

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    it("should return a 401 if client is not logged in.", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return a 400 if genre is less than 5 characters.", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return a 400 if genre is more than 50 characters.", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid.", async () => {
      await exec();

      const genre = await Genre.find({ name: "genre1" });

      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid.", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /", () => {
    let token
    let genre
    let id
    let name

    beforeEach(async () => {
      token = new User().generateAuthToken();
      genre = new Genre({ name: "genre1" });
      await genre.save();
      id = genre._id
      name = "Obinna1234"
    })

    const exec = () => {
      return request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name });
    }

    it("should return an updated genre", async () => {
      const res = await exec()

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "Obinna1234");
      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = 'Obi'

      const res = await exec()

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async() => {
      name = new Array(52).join("a")

      const res = await exec()
      
      expect(res.status).toBe(400)
    })

    it('should return 404 if genre with given id is not found', async () => {
      id = mongoose.Types.ObjectId()
      
      const res = await exec()

      expect(res.status).toBe(404)
    })
  });

  describe('Delete /', () => {
    let user
    let token
    let genre

    beforeEach(async () => {
      user = new User({ 
        _id: mongoose.Types.ObjectId(), 
        isAdmin: true 
      })
      token = user.generateAuthToken()
      genre = new Genre({ name: "Obinna1234" })
      id = genre._id
      await genre.save()
    })
    const exec = async () => {
      return request(server)
                    .delete('/api/genres/' + id)
                    .set('x-auth-token', token)
    }

    it('should delete genre', async () => {
      const res = await exec()
      
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name', "Obinna1234")
                    
    })

    it('should return 404 if genre with given id is not found', async () => {
      id = mongoose.Types.ObjectId()

      const res = await exec()
      expect(res.status).toBe(404)
    })

    it('should return 403 if user is not admin', async () => {
      user.isAdmin = false
      token = user.generateAuthToken()

      const res = await exec()
      expect(res.status).toBe(403)
    })
  })
});
