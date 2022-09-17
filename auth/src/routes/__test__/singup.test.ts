import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('returns a 400 on invalid email signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'tseest.com',
      password: 'password',
    })
    .expect(400);
});

it('returns a 400 on invalid password signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'tse@est.com',
      password: 'ord',
    })
    .expect(400);
});

it('returns a 400 on empty body signup', async () => {
  return request(app).post('/api/users/signup').send({}).expect(400);
});

it('disallow duplicate email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'tse@est.com',
      password: 'posord',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'tse@est.com',
      password: 'posord',
    })
    .expect(400);
});

it('sets a cookie after a successful signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'tse@est.com',
      password: 'posord',
    })
    .expect(201);

  expect(res.get('Set-Cookie')).toBeDefined();
});
