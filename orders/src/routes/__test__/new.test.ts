import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('Error if ticket doesnot exists', async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});

it('Error if ticket is reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 21,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'diybwib',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('Error if test doesnot exists', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 21,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 21,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
