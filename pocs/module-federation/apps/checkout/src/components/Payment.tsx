export default function Payment({
  handleCheckout,
}: {
  handleCheckout: () => void;
}) {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cardholder Name
        </label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Leonardo Salles"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Card Number
        </label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          placeholder="1234 5678 9012 3456"
        />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Expiry
          </label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            placeholder="MM/YY"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">CVV</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            placeholder="123"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Complete Purchase
      </button>
    </form>
  );
}
