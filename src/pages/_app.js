import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "../context/CartContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <CartProvider> {/* ✅ Wrap everything inside the CartProvider */}
        <Navbar />
        <Component {...pageProps} />
      </CartProvider>
    </SessionProvider>
  );
}
