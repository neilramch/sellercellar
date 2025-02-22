import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await connectDB();
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
        });
      }
      return true;
    },
    async session({ session }) {
      await connectDB();
      const user = await User.findOne({ email: session.user.email });

      if (user) {
        session.userId = user._id; // Attach user ID to session
      }
      
      return session;
    },
  },
});
