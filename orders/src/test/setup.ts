import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

jest.mock('../nats-wrapper.ts');

let mongo: any;

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

global.signin = () => {
  // build a jwt payload. { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
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
