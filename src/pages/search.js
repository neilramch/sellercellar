import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SearchResults() {
  const router = useRouter();
  const { q } = router.query; // Get search query from URL
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (!router.isReady || !q) return; // Ensure query is available
  
    async function fetchSearchResults() {
      try {
        console.log("🔍 Searching for:", q); // Debugging
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        console.log("✅ API Response:", data);
        setProducts(data);
      } catch (error) {
        console.error("❌ Search error:", error);
      }
    }
  
    fetchSearchResults();
  }, [router.isReady, q]);
  
  console.log("🔍 Query Parameter (q):", q);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{q}"</h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
  <div key={String(product._id)} className="border p-4 rounded-lg shadow-md">
    <img
      src={product.images?.[0] || "/placeholder.jpg"}
      alt={product.title}
      className="w-full h-40 object-cover rounded"
    />
    <h2 className="text-lg font-bold mt-2">{product.title}</h2>
    <p className="text-gray-600">${product.price.toFixed(2)}</p>
    <Link href={`/product/${String(product._id)}`} className="text-blue-500">
      View Details
    </Link>
  </div>
))}

        </div>
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}
    </div>
  );
}
