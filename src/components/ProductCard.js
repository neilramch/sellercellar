import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white">
      <img src={product.images[0] || "/placeholder.jpg"} alt={product.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-bold">{product.title}</h2>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
        <Link href={`/product/${product._id}`} className="text-blue-500 hover:underline">
          View Details
        </Link>
      </div>
    </div>
  );
}
