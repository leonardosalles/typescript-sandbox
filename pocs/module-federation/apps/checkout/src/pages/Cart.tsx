import Header from "../components/Header";
import Summary from "../components/Summary";
import Payment from "../components/Payment";
import { useCartStore } from "@module-federation-poc/shared";
import { useEffect } from "react";

export default function CheckoutPage() {
  const { cart, loadFromStorage, updateQuantity, removeItem, clearCart } =
    useCartStore();

  useEffect(() => {
    if (cart.length === 0) {
      loadFromStorage();
    }
  }, []);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    alert("Checkout successful!");
    clearCart();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10 mt-10">
        {/* Cart */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 font-bold ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Order Summary and Payment */}
        <section className="bg-white p-6 rounded shadow">
          <Summary total={total} />

          {/* Payment Form */}
          <Payment handleCheckout={handleCheckout} />
        </section>
      </main>
    </div>
  );
}
