import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">🛒 Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item._id} className="flex justify-between border-b p-4">
                <img src={item.images?.[0] || "/placeholder.jpg"} alt={item.title} className="w-20 h-20 object-cover" />
                <div className="flex-1 ml-4">
                  <h2 className="text-lg font-bold">{item.title}</h2>
                  <p>${item.price.toFixed(2)} x {item.quantity}</p>
                  <button onClick={() => removeFromCart(item._id)} className="text-red-500 mt-2">Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <button onClick={clearCart} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Clear Cart</button>
        </>
      )}

      <div className="mt-6">
        <Link href="/">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Continue Shopping</button>
        </Link>
      </div>
    </div>
  );
}
