import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ErrorMessage, Form, Formik, FormikConfig, Field } from "formik";
import React from "react";
import ReactDOM from "react-dom";
import * as yup from "yup";

import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  ElementState,
} from "../.";

const App = () => {
  const stripe = loadStripe(process.env.STRIPE_KEY);

  return (
    <Elements stripe={stripe}>
      <Payment />
    </Elements>
  );
};

interface PaymentValues {
  card_number: ElementState;
  card_expiry: ElementState;
  card_cvc: ElementState;
}

const Payment: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const config: FormikConfig<PaymentValues> = {
    initialValues: {
      card_number: new ElementState(),
      card_expiry: new ElementState(),
      card_cvc: new ElementState(),
    },

    validationSchema: yup.object().shape({
      card_number: yup.object().cardNumberElement(),
      card_expiry: yup.object().cardExpiryElement(),
      card_cvc: yup.object().cardCvcElement(),
    }),

    onSubmit: () => {
      console.log(stripe, elements);
    },
  };

  return (
    <Formik {...config}>
      <Form>
        <CardNumberElement name="card_number" />
        <ErrorMessage name="card_number" />

        <CardExpiryElement name="card_expiry" />
        <ErrorMessage name="card_expiry" />

        <CardCvcElement name="card_cvc" />
        <ErrorMessage name="card_cvc" />
      </Form>
    </Formik>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
