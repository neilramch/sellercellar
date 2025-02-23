import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!id) return;

    async function fetchUserProfile() {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();
        setUser(data.user);
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUserProfile();
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{user.name}</h1>
      <p>{user.bio || "No bio available"}</p>

      <h2 className="text-2xl mt-6">Listings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {products.map((product) => (
          <Link key={product._id} href={`/product/${product._id}`}>
            <div className="border p-4 rounded-lg">
              <img src={product.images?.[0] || "/placeholder.jpg"} className="w-full h-40 object-cover" />
              <h3>{product.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
