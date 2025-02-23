import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        console.log("🔍 Fetching product details for ID:", id);
        const res = await fetch(`/api/products/${id}`);

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Product data:", data);
        setProduct(data);
      } catch (error) {
        console.error("❌ Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading product details...</p>;
  }

  if (!product) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold text-red-500">Product not found</h2>
        <Link href="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div>
          <img
            src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "/placeholder.jpg"}
            alt={product.title}
            className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-500 text-lg mt-2">{product.category}</p>
          <p className="text-2xl font-semibold text-green-600 mt-2">${product.price.toFixed(2)}</p>
          <p className="text-gray-700 mt-4">{product.description}</p>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => addToCart(product)}
              className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow hover:bg-green-600 transition"
            >
              Add to Cart 🛒
            </button>
            <Link href="/cart">
              <button className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition">
                View Cart
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
