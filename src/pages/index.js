import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "../components/ProductCard"; // ✅ Ensure this is imported!
import Sidebar from "../components/Sidebar"; // ✅ Ensure this is correct


export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      if (loading || !hasMore) return;
      setLoading(true);

      try {
        console.log(`🔍 Fetching home page data (Page ${page})...`);
        const res = await fetch(`/api/products/home?page=${page}`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        console.log("✅ Home Page Products:", data);

        if (data.marketplace.length === 0) {
          setHasMore(false);
        } else {
          setAllProducts((prev) => [...prev, ...data.marketplace]);
        }

        setFeaturedProducts(data.featured);
        setRecentProducts(data.recent);
        setPopularProducts(data.popular);
      } catch (error) {
        console.error("❌ Error fetching home page products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !loading && hasMore) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center my-10">
        {/* <h1 className="text-4xl font-bold">Welcome to Seller Cellar</h1>
        <p className="text-gray-600 mt-2">Discover unique products from independent sellers.</p> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-10">
          
        <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-md hover:shadow-lg transition ease-in-out">
                <a 
                href="/categories" 
                className="col-span-1 sm:col-span-2 relative overflow-hidden rounded-lg shadow-lg"
                >
                <img 
                    src="/Browse.svg" 
                    alt="Browse Categories" 
                    className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center font-extralight bg-black bg-opacity-40 text-white text-2xl font-bold">
                    Browse Categories
                </div>
                </a>
            </div>
        </section>


          <section>
            <h2 className="text-2xl font-bold mb-4">🔥 Most Popular</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {popularProducts.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">🛍️ Marketplace</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {allProducts.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
            {loading && <p className="text-center text-gray-500 mt-4">Loading more products...</p>}
            {!hasMore && <p className="text-center text-gray-500 mt-4">No more products to load.</p>}
          </section>
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
