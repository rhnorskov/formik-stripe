import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";

interface WithElementsOptionsKey extends StripeElementsOptions {
  key: string;
  stripe?: never;
}

interface WithElementsOptionsStripe extends StripeElementsOptions {
  key?: never;
  stripe: React.ComponentProps<typeof Elements>["stripe"];
}

export type WithElementsOptions =
  | WithElementsOptionsKey
  | WithElementsOptionsStripe;

export function withElements(options: WithElementsOptions) {
  const { key, stripe, ...elementsOptions } = options || {};

  return function<T>(WrappedComponent: React.ComponentType<T>) {
    const displayName =
      WrappedComponent.displayName || WrappedComponent.name || "Component";

    const ComponentWithElements = (props: T) => {
      const stripePromise = stripe || loadStripe(key!);

      return (
        <Elements stripe={stripePromise} options={elementsOptions}>
          <WrappedComponent {...(props as T)} />
        </Elements>
      );
    };

    ComponentWithElements.displayName = `withElements(${displayName})`;

    return ComponentWithElements;
  };
}
