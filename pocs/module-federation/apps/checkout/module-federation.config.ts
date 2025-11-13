export const mfConfig = {
  name: "checkout",
  exposes: {
    "./CartPage": "./src/pages/Cart",
    "./PaymentForm": "./src/components/Payment",
    "./Summary": "./src/components/Summary",
    "./Header": "./src/components/Header",
  },
  shared: ["react", "react-dom"],
};
