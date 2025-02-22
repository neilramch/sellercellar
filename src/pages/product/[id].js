import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        console.log("🔍 Fetching product details for ID:", id);
        const res = await fetch(`/api/products/${id}`);

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Product data:", data);
        setProduct(data);
      } catch (error) {
        console.error("❌ Error fetching product details:", error);
      }
    }

    fetchProduct();
  }, [id]);

  if (!product) {
    return <p className="text-center text-gray-500 mt-10">Loading product details...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img
        src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "/placeholder.jpg"}
        alt={product.title}
        className="w-full h-96 object-cover rounded-lg"
      />
      <h1 className="text-3xl font-bold mt-4">{product.title}</h1>
      <p className="text-gray-600 mt-2">${product.price.toFixed(2)}</p>
      <p className="mt-4">{product.description}</p>
    </div>
  );
}
