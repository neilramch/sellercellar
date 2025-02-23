import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Wishlist() {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!session) return;

    async function fetchWishlist() {
      try {
        const res = await fetch(`/api/wishlist?userEmail=${session.user.email}`);
        const data = await res.json();
        setWishlist(data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    }

    fetchWishlist();
  }, [session]);

  if (!session) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold">Please Sign In to Access Your Wishlist</h2>
        <button onClick={() => signIn("google")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Sign In
        </button>
      </div>
    );
  }

  // ✅ Ensure each product in the wishlist is unique
  // ✅ Ensure `productId` exists before mapping
const filteredWishlist = wishlist.filter((p) => p.productId && p.productId._id);
const uniqueWishlist = Array.from(new Map(filteredWishlist.map((p) => [p.productId._id, p])).values());


  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{session.user.name}'s Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {uniqueWishlist.length > 0 ? (
          uniqueWishlist.map(({ productId }) => (
            <Link key={productId._id} href={`/product/${productId._id}`}>
              <div className="border p-4 rounded-lg shadow-md">
                <img src={productId.images?.[0] || "/placeholder.jpg"} className="w-full h-40 object-cover" />
                <h3 className="text-lg font-bold mt-2">{productId.title}</h3>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">Your wishlist is empty.</p>
        )}
      </div>
    </div>
  );
}
