import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const PORT = 3000;

console.log(
  process.env.NATS_CLUSTER_ID!,
  process.env.NATS_CLIENT_ID!,
  process.env.NATS_URL!
);

const start = async () => {
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );

    // Graceful shutdown
    natsWrapper.client.on('close', () => {
      console.log('NATS conn closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    console.log('Connecting to MONGODB');
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MONGODB');
  } catch (err) {
    console.log(err);
  }

  app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}....`);
  });
};

start();
