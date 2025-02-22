import { connectDB } from "../../../lib/mongodb";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const { id } = req.query;
      console.log("🔍 Fetching product with ID:", id);

      const product = await Product.findById(id);
      if (!product) {
        console.error("❌ Product not found");
        return res.status(404).json({ error: "Product not found" });
      }

      console.log("✅ Product found:", product);
      return res.status(200).json(product);
    } catch (error) {
      console.error("❌ Error fetching product:", error);
      return res.status(500).json({ error: "Server error", details: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      console.log("🗑 Deleting product with ID:", id);

      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        console.error("❌ Product not found");
        return res.status(404).json({ error: "Product not found" });
      }

      console.log("✅ Product deleted:", deletedProduct);
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      return res.status(500).json({ error: "Server error", details: error.message });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
