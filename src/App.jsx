import React, { useState } from "react";
import "bootswatch/dist/lux/bootstrap.min.css";
import "./App.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import cafe from "../public/cafe.jpg"


const stripePromise = loadStripe("<your public key here>");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    setLoading(true);

    if (!error) {
      const { id } = paymentMethod;
      try {
        const response = await fetch("http://localhost:3001/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            amount: 6000,
          }),
        });

        const data = await response.json();
        console.log(data);

        elements.getElement(CardElement).clear();
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  console.log(!stripe || loading);

  return (
    <form className="payment-form card card-body" onSubmit={handleSubmit}>
      {/* Product Information */}
      <img
        src={cafe}
        alt="CafeToken"
        className="product-img img-fluid"
      />

      <h3 className="product-price text-center my-2">Price: 60$</h3>

      {/* User Card Input */}
      <div className="form-group">
        <CardElement className="card-input" />
      </div>

      <button disabled={!stripe} className="buy-button btn btn-success">
        {loading ? (
          <div className="spinner-border text-light" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          "Buy"
        )}
      </button>
    </form>
  );
};

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row h-100">
          <div className="col-md-4 offset-md-4 h-100">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
