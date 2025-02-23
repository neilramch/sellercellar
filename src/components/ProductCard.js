import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProductCard({ product }) {
  const { data: session } = useSession();
  const [isWishlisted, setIsWishlisted] = useState(false);

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
    <div className="border rounded-lg shadow-md p-4 hover:shadow-lg transition relative">
      {/* Debugging: Log if session exists */}
      {console.log("📌 Session Data:", session)}

      {/* Wishlist Button - Heart ❤️ */}
      {session && (
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 p-2 text-lg rounded-full transition ${
            isWishlisted ? "bg-red-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>
      )}

      {/* Product Image */}
      <img src={product.images?.[0] || "/placeholder.jpg"} alt={product.title} className="w-full h-40 object-cover rounded" />
      
      {/* Product Details */}
      <h3 className="text-lg font-bold mt-2">{product.title}</h3>
      <p className="text-gray-600">${product.price.toFixed(2)}</p>
      <a href={`/product/${product._id}`} className="text-blue-500">View</a>
    </div>
  );
}
