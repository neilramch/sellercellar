import Link from "next/link";
import { useEffect, useState } from "react";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        console.log("🔍 Fetching categories...");
        const res = await fetch(`/api/products/categories`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        console.log("✅ Categories:", data);
        setCategories(data);
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Categories</h1>

      {categories.length > 0 ? (
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <li key={category}>
              <Link href={`/categories/${category}`} className="block p-4 bg-gray-200 rounded shadow">
                {category}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No categories found.</p>
      )}
    </div>
  );
}
