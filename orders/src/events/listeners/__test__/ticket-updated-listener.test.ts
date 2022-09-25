import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@mctickects/common';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // create an instance
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'NEWconcert',
    price: 555,
    userId: '7889456',
  };
  // create a fake message obj
  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it('Finds -> updates -> saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if event as skipped version', async () => {
  const { listener, data, msg, ticket } = await setup();
  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
