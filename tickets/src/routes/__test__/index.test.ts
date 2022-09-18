import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

const createTicket = (title: string, price: number) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201);
};

it('can fetch tickets', async () => {
  await createTicket('one', 5);
  await createTicket('two', 15);
  await createTicket('three', 55);

  const res = await request(app).get(`/api/tickets/`).send().expect(200);
  expect(res.body.length).toEqual(3);
});
