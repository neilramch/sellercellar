import { connectDB } from "../../../lib/mongodb";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    console.log("🔍 Fetching distinct product categories...");
    const categories = await Product.distinct("category");
    console.log(`✅ Found ${categories.length} categories`);
    return res.status(200).json(categories);
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
