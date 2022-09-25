import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('Marks an order as cancelled', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 21,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  // Create user
  const user = global.signin();

  // Create one order for user
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make req to cancel order for user
  const { body: fetchedOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // Make req to cancel order for user
  const updatedOrder = await Order.findById(order.id);

  //   Make sure we only got order for User two
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an event for order:cancelled', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 21,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  // Create user
  const user = global.signin();

  // Create one order for user
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make req to cancel order for user
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
