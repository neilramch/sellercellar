import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Profile() {
  const { data: session } = useSession();
  const [userProducts, setUserProducts] = useState([]);

  useEffect(() => {
    if (!session) return;

    async function fetchUserProducts() {
      try {
        const res = await fetch(`/api/products?seller=${session.user.email}`);
        const data = await res.json();
        setUserProducts(data);
      } catch (error) {
        console.error("Error fetching user products:", error);
      }
    }

    fetchUserProducts();
  }, [session]);

  if (!session) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold">Please Sign In to Access Your Profile</h2>
        <button onClick={() => signIn("google")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{session.user.name}'s Profile</h1>
      <p>Email: {session.user.email}</p>

      <h2 className="text-2xl mt-6">Your Listings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {userProducts.length > 0 ? (
          userProducts.map((product) => (
            <Link key={product._id} href={`/product/${product._id}`}>
              <div className="border p-4 rounded-lg shadow-md">
                <img src={product.images?.[0] || "/placeholder.jpg"} className="w-full h-40 object-cover" />
                <h3 className="text-lg font-bold mt-2">{product.title}</h3>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">You haven't listed any products yet.</p>
        )}
      </div>
    </div>
  );
}
