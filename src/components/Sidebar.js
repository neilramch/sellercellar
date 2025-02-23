import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="md:col-span-1 bg-gray-100 p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">🔥 Trending</h2>
      <ul>
        <li><Link href="/categories/Handmade">#Handmade</Link></li>
        <li><Link href="/categories/Furniture">#Furniture</Link></li>
        <li><Link href="/categories/Jewelry">#Jewelry</Link></li>
      </ul>
      <h2 className="text-lg font-bold mt-6 mb-4">📌 Categories</h2>
      <ul>
        <li><Link href="/categories">View All Categories</Link></li>
      </ul>
    </div>
  );
}
