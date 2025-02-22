import { connectDB } from "../../../lib/mongodb";
import Product from "../../../models/Product";
import User from "../../../models/User";
import multer from "multer";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Configuration
const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: { bodyParser: false }, // Required for handling file uploads
};

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    return new Promise((resolve, reject) => {
      upload.single("image")(req, res, async (err) => {
        if (err) {
          console.error("❌ Multer Upload Error:", err);
          return res.status(500).json({ error: "File upload failed" });
        }

        console.log("🔍 Incoming Request Body:", req.body);
        console.log("🔍 Incoming File:", req.file);

        const { title, description, price, category, sellerEmail } = req.body;

        if (!title || !description || !price || !category || !sellerEmail) {
          console.error("❌ Missing required fields");
          return res.status(400).json({ error: "Missing required fields" });
        }

        const user = await User.findOne({ email: sellerEmail });
        if (!user) {
          console.error("❌ Seller not found");
          return res.status(404).json({ error: "Seller not found" });
        }

        if (!req.file) {
          console.error("❌ No image file uploaded");
          return res.status(400).json({ error: "Image file is required" });
        }

        console.log("📤 Uploading image to Cloudinary...");

        const uploadResponse = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "seller-cellar/products" },
            (error, result) => {
              if (error) {
                console.error("❌ Cloudinary Upload Error:", error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(req.file.buffer);
        });

        console.log("✅ Image uploaded successfully:", uploadResponse.secure_url);

        const newProduct = new Product({
          title,
          description,
          price: parseFloat(price),
          images: [uploadResponse.secure_url],
          category,
          seller: user._id,
        });

        await newProduct.save();
        console.log("✅ Product Created:", newProduct);

        res.status(201).json(newProduct);
        resolve();
      });
    });
  }

  if (req.method === "GET") {
    try {
      console.log("🔍 GET request received:", req.query);

      const { seller } = req.query;
      let filter = {};

      if (seller) {
        const user = await User.findOne({ email: seller });
        if (!user) {
          console.error("❌ Seller not found:", seller);
          return res.status(404).json({ error: "Seller not found" });
        }
        filter.seller = user._id;
      }

      const products = await Product.find(filter).populate("seller");
      console.log("✅ Products found:", products.length);

      return res.status(200).json(products);
    } catch (error) {
      console.error("❌ Server error in GET `/api/products`:", error);
      return res.status(500).json({ error: "Server error", details: error.message });
    }
  }

  console.error("❌ Method Not Allowed:", req.method);
  return res.status(405).json({ error: "Method Not Allowed" });
}
