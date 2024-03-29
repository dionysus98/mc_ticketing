import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@mctickects/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublihser } from '../events/publishers/order-created-publihser';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((ip) => mongoose.Types.ObjectId.isValid(ip))
      .withMessage('ticketId is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to buy
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure it's not reserved
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate the expiration for order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build and save the order
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    // Publish an order:creeated event
    new OrderCreatedPublihser(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      version: order.version,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
