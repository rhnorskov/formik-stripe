import React from "react";
import { useField } from "formik";
import { addMethod, object, ObjectSchema } from "yup";
import { StripeCardExpiryElementChangeEvent } from "@stripe/stripe-js";
import {
  CardExpiryElement as StripeCardExpiryElement,
  CardExpiryElementProps as StripeCardExpiryElementProps,
} from "@stripe/react-stripe-js";

import { ElementState } from "./ElementState";

export interface CardExpiryElementProps extends StripeCardExpiryElementProps {
  name: string;
}

export const CardExpiryElement: React.FC<CardExpiryElementProps> = ({
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

  const handleChange = (event: StripeCardExpiryElementChangeEvent) => {
    onChange?.(event);
    setValue(new ElementState(event));
  };

  return (
    <StripeCardExpiryElement
      {...props}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};

function cardExpiryElement(
  this: ObjectSchema<object>,
  messages?: {
    empty?: string;
    invalid_month?: string;
    invalid_year?: string;
    incomplete?: string;
  }
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

      if (value.error === "invalid_expiry_month")
        return this.createError({
          path: this.path,
          message: messages?.invalid_month || `${this.path} month is invalid`,
        });

      if (value.error === "invalid_expiry_year")
        return this.createError({
          path: this.path,
          message: messages?.invalid_year || `${this.path} year is invalid`,
        });

      if (value.error === "invalid_expiry_year_past")
        return this.createError({
          path: this.path,
          message: messages?.invalid_year || `${this.path} year is invalid`,
        });

      if (value.error === "incomplete_expiry")
        return this.createError({
          path: this.path,
          message: messages?.incomplete || `${this.path} is incomplete`,
        });

      return true;
    },
  });
}

addMethod<ObjectSchema>(object, "cardExpiryElement", cardExpiryElement);

declare module "yup" {
  interface ObjectSchema {
    cardExpiryElement: typeof cardExpiryElement;
  }
}
