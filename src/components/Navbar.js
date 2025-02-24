import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";


export default function NavBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();


  const handleSearch = (e) => {
    e.preventDefault();
    const searchQuery = e.target.search.value.trim(); // Get input value
    if (!searchQuery) return; // Prevent empty search
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };
  

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link href="/" className="font-extralight text-2xl">Seller Cellar</Link>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex">
        <input
            type="text"
            name="search" // This is needed to access e.target.search.value
            placeholder="Search..."
            className="w-[30svw] px-3 py-2 text-black rounded-l-md"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-r-md">🔍</button>
      </form>


      {/* Navigation Links */}
      <div className="flex items-center space-x-4">
        <Link href="/cart" className="relative"> 🛒 Cart ({cart.length}) </Link>
        <Link href="/categories">Categories</Link>
        <Link href="/dashboard">Dashboard</Link>


        {/* User Dropdown Menu */}
        {session ? (
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2">
              <img src={session.user.image || "/default-avatar.png"} alt="User Avatar" className="w-8 h-8 rounded-full" />
              <span>{session.user.name.split(" ")[0]}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                <Link href="/wishlist" className="block px-4 py-2 hover:bg-gray-100">Wishlist</Link>
                <button onClick={() => signOut()} className="w-full text-left px-4 py-2 hover:bg-gray-100">Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => signIn("google")} className="px-4 py-2 bg-green-500 rounded">Sign In</button>
        )}
      </div>
    </nav>
  );
}
