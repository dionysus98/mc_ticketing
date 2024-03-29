import mongoose from 'mongoose';
import { app } from './app';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
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

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

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
