import { connectDB } from "../../lib/mongodb";
import Message from "../../models/Message";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { sender, receiver, content } = req.body;

    if (!sender || !receiver || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMessage = new Message({ sender, receiver, content });
    await newMessage.save();
    return res.status(201).json(newMessage);
  }

  if (req.method === "GET") {
    const { userId } = req.query;
    const messages = await Message.find({ $or: [{ sender: userId }, { receiver: userId }] });
    return res.status(200).json(messages);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
