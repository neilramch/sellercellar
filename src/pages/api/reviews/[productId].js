import { connectDB } from "../../../lib/mongodb";
import Review from "../../../models/Review";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { productId } = req.query;
    const { user, rating, comment } = req.body;

    if (!productId || !user || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newReview = new Review({ productId, user, rating, comment });
    await newReview.save();
    return res.status(201).json(newReview);
  }

  if (req.method === "GET") {
    const { productId } = req.query;
    const reviews = await Review.find({ productId });
    return res.status(200).json(reviews);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
