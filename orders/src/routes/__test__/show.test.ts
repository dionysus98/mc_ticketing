import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('Fetches order for user', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 21,
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

  // Make req to get orders for user Two
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  //   Make sure we only got order for User two
  expect(fetchedOrder.id).toEqual(order.id);
});

it('Error if invalid user', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 21,
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

  // Make req to get orders for user Two
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
