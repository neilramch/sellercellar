import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    async function fetchSellerProducts() {
      console.log("🔍 Fetching products for:", session?.user?.email);

      try {
        const res = await fetch(`/api/products?seller=${session?.user?.email}`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        console.log("✅ Products loaded:", data);

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("❌ API returned unexpected format:", data);
          setProducts([]);
        }
      } catch (error) {
        console.error("❌ Fetch Error:", error);
        setProducts([]);
      }
    }

    fetchSellerProducts();
  }, [session, status]);

  // ✅ Add the deleteProduct function
  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        console.log("✅ Product deleted:", data);
        setProducts(products.filter((product) => product._id !== productId)); // Remove from state
      } else {
        console.error("❌ Error deleting product:", data);
        alert("Error deleting product: " + data.error);
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      alert("Failed to delete product.");
    }
  };

  if (status === "loading") return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  if (!session) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500">You must be logged in to access the dashboard.</p>
        <button onClick={() => signIn("google")} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
      <Link href="/product/create" className="px-4 py-2 bg-blue-500 text-white rounded mb-6 inline-block">
        Add New Product
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="border rounded-lg shadow-md p-4">
              <img
                src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "/placeholder.jpg"}
                alt={product.title}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="text-lg font-bold mt-2">{product.title}</h2>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              <div className="flex justify-between mt-3">
                <Link href={`/product/edit/${product._id}`} className="text-blue-500">Edit</Link>
                <button onClick={() => deleteProduct(product._id)} className="text-red-500">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
}
