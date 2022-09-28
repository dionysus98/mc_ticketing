import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper.ts');

let mongo: any;

process.env.STRIPE_KEY =
  'sk_test_51Ln0rjSGVRbey66PTZpBCf8jZBua4bw6wH1NNQKX03JLClOgwbGso7FALBb0L3Y8eG5i2iB3wR1mKYr2dM0XUnC700FrUwqScF';

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let coll of collections) {
    await coll.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // build a jwt payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test1@test.com',
  };

  // create jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build session object {jwt: MY-JWT}
  const session = { jwt: token };
  // Take JSON then encode it as base64
  const sessionJSON = JSON.stringify(session);
  // return a string with encoded cookie
  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};
