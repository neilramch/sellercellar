import { connectDB } from "../../lib/mongodb";
import Wishlist from "../../models/Wishlist";
import Product from "../../models/Product"; // Import the Product model


export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { userEmail, productId } = req.body;

    if (!userEmail || !productId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // ✅ Check if the product exists in the database
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      // ✅ Check if the product is already in the wishlist
      const existingWishlistItem = await Wishlist.findOne({ userEmail, productId });
      if (existingWishlistItem) {
        return res.status(400).json({ error: "Product already in wishlist" });
      }
      
      // ✅ If everything is fine, save to wishlist
      const newWishlistItem = new Wishlist({ userEmail, productId });
      await newWishlistItem.save();
      return res.status(201).json(newWishlistItem);
    }
  if (req.method === "GET") {
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({ error: "Missing user email" });
    }
    const wishlist = await Wishlist.find({ userEmail }).populate({
        path: "productId",
        select: "title images price", // ✅ Fetch only necessary fields
      }).lean();
      
      // ✅ Filter out wishlist items where `productId` is null (deleted products)
      const validWishlist = wishlist.filter((item) => item.productId !== null);
      
      return res.status(200).json(validWishlist);
      
  }

  if (req.method === "DELETE") {
    const { userEmail, productId } = req.body;

    const deletedItem = await Wishlist.findOneAndDelete({ userEmail, productId });

if (!deletedItem) {
  return res.status(404).json({ error: "Wishlist item not found" });
}

return res.status(200).json({ message: "Product removed from wishlist" });

  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
