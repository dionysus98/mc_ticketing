import {
    PaymentCreatedEvent,
    Publisher,
    Subjects,
  } from '@mctickects/common';
  
  export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  }
  