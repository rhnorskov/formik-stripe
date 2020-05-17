import React from "react";
import { useField } from "formik";
import { addMethod, object, ObjectSchema } from "yup";
import { StripeCardNumberElementChangeEvent } from "@stripe/stripe-js";
import {
  CardNumberElement as StripeCardNumberElement,
  CardNumberElementProps as StripeCardNumberElementProps,
} from "@stripe/react-stripe-js";

import { ElementState } from "./ElementState";

export interface CardNumberElementProps extends StripeCardNumberElementProps {
  name: string;
}

export const CardNumberElement: React.FC<CardNumberElementProps> = ({
  name,
  onBlur,
  onChange,
  ...props
}) => {
  const [, { value }, { setValue, setTouched }] = useField<ElementState>(name);

  const handleBlur = () => {
    onBlur?.();
    setTouched(true);
    if (value.empty) setValue(new ElementState());
  };

  const handleChange = (event: StripeCardNumberElementChangeEvent) => {
    onChange?.(event);
    setValue(new ElementState(event));
  };

  return (
    <StripeCardNumberElement
      {...props}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};

function cardNumberElement(
  this: ObjectSchema<object>,
  messages?: { empty?: string; invalid?: string; incomplete?: string }
) {
  return this.test({
    name: "card-number-element",
    test: function(value: ElementState) {
      if (!(value instanceof ElementState))
        throw new Error("Object must be an instance of `ElementState`.");

      if (value.empty)
        return this.createError({
          path: this.path,
          message: messages?.empty || `${this.path} is required`,
        });

      if (value.error === "invalid_number")
        return this.createError({
          path: this.path,
          message: messages?.invalid || `${this.path} is invalid`,
        });

      if (value.error === "incomplete_number")
        return this.createError({
          path: this.path,
          message: messages?.incomplete || `${this.path} is incomplete`,
        });

      return true;
    },
  });
}

addMethod<ObjectSchema>(object, "cardNumberElement", cardNumberElement);

declare module "yup" {
  interface ObjectSchema {
    cardNumberElement: typeof cardNumberElement;
  }
}
