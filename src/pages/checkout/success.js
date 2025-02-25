import Link from "next/link";

export default function CheckoutSuccess() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold text-green-500">🎉 Payment Successful!</h1>
      <p className="text-lg text-gray-600 mt-2">Thank you for your purchase.</p>
      <Link href="/">
        <button className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
          Back to Home
        </button>
      </Link>
    </div>
  );
}
