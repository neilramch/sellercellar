import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!category) return;

    async function fetchCategoryProducts() {
      try {
        console.log(`🔍 Fetching products in category: ${category}`);
        const res = await fetch(`/api/products/category?q=${encodeURIComponent(category)}`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        console.log("✅ Category products:", data);
        setProducts(data);
      } catch (error) {
        console.error("❌ Error fetching category products:", error);
      }
    }

    fetchCategoryProducts();
  }, [category]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Products in "{category}"</h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg shadow-md">
              <img
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={product.title}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="text-lg font-bold mt-2">{product.title}</h2>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              <Link href={`/product/${product._id}`} className="text-blue-500">View Details</Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found in this category.</p>
      )}
    </div>
  );
}
