import { connectDB } from "../../../lib/mongodb";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { page = 1 } = req.query;
    const limit = 9;
    const skip = (page - 1) * limit;

    console.log(`📥 Fetching page ${page} with limit ${limit}...`);

    const featured = await Product.aggregate([{ $sample: { size: 3 } }]);
    const popular = await Product.find().sort({ views: -1 }).limit(3);
    const recent = await Product.find().sort({ createdAt: -1 }).limit(5);
    const marketplace = await Product.find().skip(skip).limit(limit);

    console.log(`✅ Page ${page}: ${marketplace.length} products found`);

    return res.status(200).json({ featured, popular, recent, marketplace });
  } catch (error) {
    console.error("❌ Error fetching home data:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
