import { OrderCancelledEvent, Publisher, Subjects } from '@mctickects/common';

export class OrderCancelledPublihser extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
