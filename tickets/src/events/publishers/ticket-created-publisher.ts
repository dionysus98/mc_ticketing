import { Publisher, Subjects, TicketCreatedEvent } from '@mctickects/common';

export class TicketCreatedPublihser extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
