import { connectDB } from "../../../lib/mongodb";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Missing search query" });
    }

    console.log("🔍 Searching for:", q);

    // Case-insensitive search in title & description
    const products = await Product.find({
      $or: [
        { title: { $regex: q, $options: "i" } }, 
        { description: { $regex: q, $options: "i" } }
      ]
    });

    console.log(`✅ Found ${products.length} results`);
    return res.status(200).json(products);
  } catch (error) {
    console.error("❌ Error in search:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
