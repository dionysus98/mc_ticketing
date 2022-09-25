import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@mctickects/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
