import mongoose from "mongoose";
import { connectDB } from "../../../lib/mongodb";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const { id } = req.query;

      console.log("🔍 Fetching product with ID:", id);

      // ✅ Convert `id` to an ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error("❌ Invalid ObjectId format:", id);
        return res.status(400).json({ error: "Invalid product ID format" });
      }

      const product = await Product.findOne({ _id: new mongoose.Types.ObjectId(id) }).lean();

      if (!product) {
        console.error("❌ Product not found:", id);
        return res.status(404).json({ error: "Product not found" });
      }

      console.log("✅ Product found:", product);
      return res.status(200).json(product);
    } catch (error) {
      console.error("❌ Error fetching product:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
