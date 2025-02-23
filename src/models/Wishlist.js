import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
});

export default mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema);
