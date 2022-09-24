import { Ticket } from '../../models/ticket';
import request from 'supertest';
import { app } from '../../app';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 21,
  });

  await ticket.save();

  return ticket;
};

it('Fetches order for user', async () => {
  // Create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  // Create two users
  const userOne = global.signin();
  const userTwo = global.signin();

  // Create one order for user One
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Create Two order for user Two
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Make req to get orders for user Two
  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  //   Make sure we only got order for User two
  expect(res.body.length).toEqual(2);
  expect(res.body[0].id).toEqual(orderOne.id);
  expect(res.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(res.body[1].id).toEqual(orderTwo.id);
  expect(res.body[1].ticket.id).toEqual(ticketThree.id);
});
