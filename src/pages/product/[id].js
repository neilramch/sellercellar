import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewInput, setReviewInput] = useState({ user: "", rating: "", comment: "" });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);

        const reviewsRes = await fetch(`/api/reviews/${id}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);

        // Fetch related products based on category
        const relatedRes = await fetch(`/api/products?category=${data.category}`);
        const relatedData = await relatedRes.json();
        setRelatedProducts(relatedData.filter((item) => item._id !== id));
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // Image slideshow functions
  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };

  // Handle Review Submission
  const submitReview = async (e) => {
    e.preventDefault();

    if (!reviewInput.user || !reviewInput.rating || !reviewInput.comment) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, ...reviewInput }),
      });

      if (!res.ok) throw new Error("Failed to submit review");

      const newReview = await res.json();
      setReviews((prev) => [...prev, newReview]); // Update UI with new review
      setReviewInput({ user: "", rating: "", comment: "" });
    } catch (error) {
      console.error("❌ Error submitting review:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Product Title & Price */}
      <h1 className="text-3xl font-bold">{product?.title}</h1>
      <p className="text-2xl font-semibold text-green-600">${product?.price.toFixed(2)}</p>

      {/* Image Slideshow */}
      <div className="relative w-full mt-4">
        <img
          src={product.images?.[currentImageIndex] || "/placeholder.jpg"}
          alt={product.title}
          className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md"
        />

        {product.images?.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-600"
            >
              ◀
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-600"
            >
              ▶
            </button>
          </>
        )}
      </div>

      {/* Product Description */}
      <p className="text-gray-700 mt-4">{product?.description}</p>

      {/* ⭐ Add to Cart & View Cart Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => addToCart(product)}
          className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow hover:bg-green-600 transition w-full sm:w-auto"
        >
          Add to Cart 🛒
        </button>
        <Link href="/cart">
          <button className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition w-full sm:w-auto">
            View Cart
          </button>
        </Link>
      </div>

      {/* Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="border-b py-4">
              <p className="font-semibold">{review.user}</p>
              <p className="text-yellow-500">⭐ {review.rating}/5</p>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}

        {/* Submit a Review */}
        <form onSubmit={submitReview} className="mt-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">Leave a Review</h3>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-2 border rounded mt-2"
            value={reviewInput.user}
            onChange={(e) => setReviewInput({ ...reviewInput, user: e.target.value })}
          />
          <input
            type="number"
            min="1"
            max="5"
            placeholder="Rating (1-5)"
            className="w-full p-2 border rounded mt-2"
            value={reviewInput.rating}
            onChange={(e) => setReviewInput({ ...reviewInput, rating: e.target.value })}
          />
          <textarea
            placeholder="Write your review..."
            className="w-full p-2 border rounded mt-2"
            value={reviewInput.comment}
            onChange={(e) => setReviewInput({ ...reviewInput, comment: e.target.value })}
          ></textarea>
          <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded w-full" type="submit">
            Submit Review
          </button>
        </form>
      </div>

      {/* "You May Also Like" Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((item) => (
              <Link key={item._id} href={`/product/${item._id}`} className="block border rounded-lg p-4 shadow hover:shadow-md">
                <img src={item.images?.[0] || "/placeholder.jpg"} className="w-full h-32 object-cover rounded" />
                <h3 className="text-sm font-semibold mt-2">{item.title}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No related products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
