import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();
export const createOrder = async (req, res) => {
  const order = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "100.00",
        },
      },
    ],
    application_context: {
      brand_name: "GameFusion",
      shipping_preference: "NO_SHIPPING",
      user_action: "PAY_NOW",
      return_url: `${process.env.URL}/payment/capture-order`,
      cancel_url: `${process.env.URL}/payment/cancel-order`,
    },
  };
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  const { data } = await axios
    .post(`${process.env.PAYPAL_API}/v1/oauth2/token`, params, {
      auth: {
        username: process.env.PAYPAL_CLI,
        password: process.env.PAYPAL_PASS,
      },
    })
    .then((response) => {
      process.env.PAYPAL_TOKEN = response.data.access_token;
    });
  axios
    .post(`${process.env.PAYPAL_API}/v2/checkout/orders`, order, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYPAL_TOKEN}`,
      },
    })
    .then((response) => {
      res.json({ data: response.data });
    })
    .catch((error) => {
      console.log(error);
      res.json({ data: error });
    });
};
export const captureOrder = async (req, res) => {
  res.send("captureOrder");
};
export const cancelOrder = async (req, res) => {
  res.send("cancelOrder");
};
