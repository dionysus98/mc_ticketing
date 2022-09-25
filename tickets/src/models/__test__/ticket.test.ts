import { Ticket } from '../ticket';

it('Implements optimistic concurrency control', async () => {
  // Create an instance of ticket
  const ticket = Ticket.build({
    title: 'ceonce',
    price: 5,
    userId: '124',
  });
  // save ticket
  await ticket.save();

  // fetch ticket twice
  const firstIns = await Ticket.findById(ticket.id);
  const secondIns = await Ticket.findById(ticket.id);

  // make two separate changed
  firstIns!.set({ price: 10 });
  secondIns!.set({ price: 15 });

  // save first ticket
  await firstIns!.save();

  // save second ticket
  try {
    await secondIns!.save();
  } catch (err) {
    return;
  }
  throw new Error('Should not be seeing this');
});

it('Increments version number', async () => {
  // Create an instance of ticket
  const ticket = Ticket.build({
    title: 'ceonce',
    price: 5,
    userId: '124',
  });

  // save ticket
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
});
