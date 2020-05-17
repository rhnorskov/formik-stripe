import React from "react";
import { useField } from "formik";
import { addMethod, object, ObjectSchema } from "yup";
import { StripeCardCvcElementChangeEvent } from "@stripe/stripe-js";
import {
  CardCvcElement as StripeCardCvcElement,
  CardCvcElementProps as StripeCardCvcElementProps,
} from "@stripe/react-stripe-js";

import { ElementState } from "./ElementState";

export interface CardCvcElementProps extends StripeCardCvcElementProps {
  name: string;
}

const CardCvcElement: React.FC<CardCvcElementProps> = ({
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

  const handleChange = (event: StripeCardCvcElementChangeEvent) => {
    onChange?.(event);
    setValue(new ElementState(event));
  };

  return (
    <StripeCardCvcElement
      {...props}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};

// @ts-ignore
CardCvcElement.__elementType = StripeCardCvcElement.__elementType;

export { CardCvcElement };

function cardCvcElement(
  this: ObjectSchema<object>,
  messages?: {
    empty?: string;
    invalid?: string;
    incorrect?: string;
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

      if (value.error === "invalid_cvc")
        return this.createError({
          path: this.path,
          message: messages?.invalid || `${this.path} is invalid`,
        });

      if (value.error === "incorrect_cvc")
        return this.createError({
          path: this.path,
          message: messages?.incorrect || `${this.path} is incorrect`,
        });

      if (value.error === "incomplete_cvc")
        return this.createError({
          path: this.path,
          message: messages?.incomplete || `${this.path} is incomplete`,
        });

      return true;
    },
  });
}

addMethod<ObjectSchema>(object, "cardCvcElement", cardCvcElement);

declare module "yup" {
  interface ObjectSchema {
    cardCvcElement: typeof cardCvcElement;
  }
}
