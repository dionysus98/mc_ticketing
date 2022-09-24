import { Publisher, Subjects, TicketUpdatedEvent } from '@mctickects/common';

export class TicketUpdatedPublihser extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
