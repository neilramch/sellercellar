import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cart.length === 0) return; // ✅ Don't run if cart is empty

    async function fetchRelatedProducts() {
      try {
        setLoading(true);

        // ✅ Get unique categories from cart items
        const categories = [...new Set(cart.map((item) => item.category))];

        // ✅ Fetch related products based on cart categories
        const res = await fetch(`/api/products?categories=${categories.join(",")}`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const relatedData = await res.json();

        // ✅ Remove products already in the cart
        const filteredRelated = relatedData.filter((item) => !cart.some((cartItem) => cartItem._id === item._id));

        setRelatedProducts(filteredRelated);
      } catch (error) {
        console.error("❌ Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedProducts();
  }, [cart]); // ✅ Runs when cart updates

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cart }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        console.error("Checkout error:", data.error);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

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
          <button
            onClick={handleCheckout}
            className="ml-[50%] mt-6 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition"
          >
            Proceed to Checkout
          </button>

          {/* ✅ You May Also Like Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : relatedProducts.length > 0 ? (
                relatedProducts.map((item) => (
                  <Link key={item._id} href={`/product/${item._id}`} className="block border rounded-lg p-4 shadow hover:shadow-md">
                    <img src={item.images?.[0] || "/placeholder.jpg"} className="w-full h-32 object-cover rounded" />
                    <h3 className="text-sm font-semibold mt-2">{item.title}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500">No related products found.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
