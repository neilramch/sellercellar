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
      return res.status(400).json({ error: "Missing category query" });
    }

    console.log("🔍 Fetching products for category:", q);

    const products = await Product.find({ category: q });
    console.log(`✅ Found ${products.length} products in category ${q}`);
    return res.status(200).json(products);
  } catch (error) {
    console.error("❌ Error fetching category products:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
