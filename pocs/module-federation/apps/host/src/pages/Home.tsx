import { router } from "../router";
import Header from "checkout/Header";
import { useCartStore } from "@module-federation-poc/shared";

const mockCart = [
  { id: 1, name: "Stylish T-Shirt", price: 79.9, quantity: 1 },
  { id: 2, name: "Comfortable Sneakers", price: 249.99, quantity: 1 },
  { id: 3, name: "Casual Cap", price: 59.5, quantity: 1 },
];

export default function HomePage() {
  const { addToCart } = useCartStore();

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to My Store
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Discover the best products curated just for you. Add them to your
            cart and checkout quickly.
          </p>
          <button
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors mb-12"
            onClick={() => router.navigate({ to: "/cart" })}
          >
            Go to Cart
          </button>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {mockCart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
              >
                <div className="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center">
                  <span className="text-gray-500">{item.name}</span>
                </div>
                <h2 className="font-semibold text-lg mb-2">{item.name}</h2>
                <p className="text-gray-600 mb-4">${item.price.toFixed(2)}</p>
                <button
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  onClick={() => {
                    addToCart({ ...item, quantity: 1 });
                    alert("Item added to cart!");
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
