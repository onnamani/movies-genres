const { User } = require("../../../models/userModel");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// jest.useFakeTimers()

const jwtKey = config.get("jwtPrivateKey");

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, jwtKey);
    expect(decoded).toMatchObject(payload);
  });
});
