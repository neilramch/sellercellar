import { connectDB } from "../../../lib/mongodb";
import Review from "../../../models/Review";

export default async function handler(req, res) {
  await connectDB(); // Ensure DB is connected

  const { productId } = req.query;

  if (req.method === "POST") {
    try {
      const { user, rating, comment } = req.body;

      if (!productId || !user || !rating || !comment) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newReview = new Review({ productId, user, rating, comment });
      await newReview.save();

      return res.status(201).json(newReview);
    } catch (error) {
      return res.status(500).json({ error: "Failed to save review" });
    }
  }

  if (req.method === "GET") {
    try {
      const reviews = await Review.find({ productId });
      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch reviews" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
