import { OrderCreatedEvent, Publisher, Subjects } from '@mctickects/common';

export class OrderCreatedPublihser extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
