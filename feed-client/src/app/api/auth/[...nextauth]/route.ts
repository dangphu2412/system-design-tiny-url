import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // Optional: Customize pages, callbacks, etc.
});

export { handler as GET, handler as POST };
