import mongoose from 'mongoose';
import { app } from './app';

const PORT = 3000;

const start = async () => {
  try {
    console.log('Connecting to MONGODB');
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MONGODB');
  } catch (err) {
    console.log(err);
  }

  app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}....`);
  });
};

start();
