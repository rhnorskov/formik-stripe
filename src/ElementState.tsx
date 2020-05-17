import { StripeElementChangeEvent } from "@stripe/stripe-js";

export class ElementState {
  readonly empty: boolean;
  readonly complete: boolean;
  readonly error: string;

  constructor(event?: StripeElementChangeEvent) {
    this.empty = event ? event.empty : true;
    this.complete = event ? event.complete : false;
    this.error = event?.error?.code || "";
  }
}
