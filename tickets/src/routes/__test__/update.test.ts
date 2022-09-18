import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('returns a 404 if id not found', async () => {
  const title = 'concert';
  const price = 25;
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(404);
});

it('returns a 401 if user not auth', async () => {
  const title = 'concert';
  const price = 25;
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title, price })
    .expect(401);
});

it('returns a 401 if user does not own ticket', async () => {
  const title = 'concert';
  const price = 25;
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'qwe',
      price: 125,
    })
    .expect(401);
});

it('returns a 400 if invalid title/price', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 22 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 125,
    })
    .expect(400);
});

it('Update the ticket if all is valid', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 22 })
    .expect(201);

  const updateres = await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new',
      price: 125,
    })
    .expect(200);

  const { body: tRes } = await request(app)
    .get(`/api/tickets/${updateres.body.id}`)
    .send()
    .expect(200);

  expect(tRes.title).toEqual('new');
  expect(tRes.price).toEqual(125);
});
