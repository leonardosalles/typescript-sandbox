export default function Summary({ total }: { total: number }) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Shipping</span>
        <span>${total > 0 ? 20 : 0}</span>
      </div>
      <div className="flex justify-between font-bold mb-6">
        <span>Total</span>
        <span>${(total + (total > 0 ? 20 : 0)).toFixed(2)}</span>
      </div>
    </>
  );
}
