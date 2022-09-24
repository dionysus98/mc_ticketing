import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('Has a router handler listening to /api/tickets for post req', async () => {
  const res = await request(app).post('/api/tickets').send({});

  expect(res.status).not.toEqual(404);
});

it('access only if user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('if user is signed in return a ok status', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(res.status).not.toEqual(401);
});

it('if invalid title return error', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: '', price: 10 });

  expect(res.status).not.toEqual(401);
});

it('if invalid price return error', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'TITLE', price: -10 });

  expect(res.status).not.toEqual(401);
});

it('creates a ticket with valid input', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'TITLE', price: 20 });

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual('TITLE');
  expect(tickets[0].price).toEqual(20);
});

it('Publishes an event', async () => {
  const title = 'asjl';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: title, price: 20 })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
