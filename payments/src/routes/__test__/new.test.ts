import { OrderStatus } from '@mctickects/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';

// jest.mock('../../stripe');

it('Error 404 if order doesnot exists', async () => {
  const orderId = new mongoose.Types.ObjectId();
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ token: 'asasas', orderId })
    .expect(404);
});

it('Error 401 if order doesnot belong to user', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: orderId,
    userId: '54545454',
    status: OrderStatus.Created,
    version: 0,
    price: 20,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ token: 'asasas', orderId: order!.id })
    .expect(401);
});

it('Error 400 if order is cancelled', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    status: OrderStatus.Cancelled,
    version: 0,
    price: 20,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ token: 'asasas', orderId: order!.id })
    .expect(400);
});

it('Success 204 if Valid input', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    status: OrderStatus.Created,
    version: 0,
    price,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ token: 'tok_visa', orderId: order.id })
    .expect(201);

  // const chargeOpts = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  // expect(chargeOpts.source).toEqual('tok_visa');
  // expect(chargeOpts.amount).toEqual(20 * 100);
  // expect(chargeOpts.currency).toEqual('usd');

  const stripeCharges = await stripe.paymentIntents.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(
    (charge) => charge.amount === price * 100
  );

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });

  expect(payment).not.toBeNull();
});
