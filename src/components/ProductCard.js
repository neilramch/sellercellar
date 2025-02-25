import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { data: session } = useSession();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!session) return;

    async function fetchWishlistStatus() {
      try {
        console.log(`🔍 Checking wishlist status for product: ${product._id}`);

        const res = await fetch(`/api/wishlist?userEmail=${session.user.email}`);
        const data = await res.json();

        console.log("✅ Wishlist Data:", data);

        const isInWishlist = data.some((item) => item.productId._id === product._id);
        setIsWishlisted(isInWishlist);
      } catch (error) {
        console.error("❌ Error fetching wishlist status:", error);
      }
    }

    fetchWishlistStatus();
  }, [session, product._id]);

  const handleWishlist = async () => {
    if (!session) {
      alert("You must be signed in to save to wishlist!");
      return;
    }

    const method = isWishlisted ? "DELETE" : "POST";

    console.log(`🛍️ ${isWishlisted ? "Removing" : "Adding"} product ${product._id} to wishlist...`);

    const res = await fetch("/api/wishlist", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail: session.user.email, productId: product._id }),
    });

    if (res.ok) {
      setIsWishlisted(!isWishlisted);
    } else {
      console.error("❌ Error updating wishlist");
    }
  };

  return (
    <div className="border rounded-lg shadow-md p-4 hover:shadow-lg transition relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg min-h-[375px] flex flex-col">
      {/* Wishlist Button - Heart ❤️ */}
      {session && (
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 p-2 text-lg rounded-full transition ${
            isWishlisted ? "bg-gray-200 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>
      )}

      {/* Product Image */}
      <img
        src={product.images?.[0] || "/placeholder.jpg"}
        alt={product.title}
        className="w-full h-40 object-cover rounded"
      />

      {/* Product Details */}
      <div className="flex-grow pb-14">
        <h3 className="text-base sm:text-lg font-bold mt-2 line-clamp-2">{product.title}</h3>
        <p className="text-gray-600 text-sm sm:text-base">${product.price.toFixed(2)}</p>
      </div>

      {/* CTA Section (Fixed to Bottom) */}
      <div className="absolute bottom-2 left-0 right-0 flex flex-col sm:flex-row justify-between items-center gap-3 p-2">
        <a href={`/product/${product._id}`} className="text-blue-500 text-sm sm:text-base">
          View
        </a>

        <button
          onClick={() => addToCart(product)}
          className="bg-green-500 text-white text-sm sm:text-base px-4 py-2 rounded w-full sm:w-auto"
        >
          Add to Cart 🛒
        </button>
      </div>
    </div>
  );
}
