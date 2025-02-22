import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Seller Cellar
        </Link>

        <div className="space-x-4">
          {session ? (
            <>
              <Link href="/dashboard" className="px-4 py-2 bg-blue-500 rounded">Dashboard</Link>
              <button onClick={() => signOut()} className="px-4 py-2 bg-red-500 rounded">Logout</button>
            </>
          ) : (
            <button onClick={() => signIn("google")} className="px-4 py-2 bg-green-500 rounded">Login</button>
          )}
        </div>
      </div>
    </nav>
  );
}
