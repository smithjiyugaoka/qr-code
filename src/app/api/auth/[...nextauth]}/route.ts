import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, user }) {
      // Add user's ID to the session object
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
})

export { handler as GET, handler as POST }
```

3. We need to set up the Google OAuth credentials. Go to the [Google Cloud Console](https://console.cloud.google.com/), create a new project (if you haven't already), and set up OAuth credentials. Once you have your Client ID and Client Secret, add them to your Replit secrets:

   - Add a new secret with key `GOOGLE_CLIENT_ID` and your Google Client ID as the value.
   - Add another secret with key `GOOGLE_CLIENT_SECRET` and your Google Client Secret as the value.

4. Now, let's update our `src/lib/auth.ts` file to export some useful authentication utilities:

<antArtifact identifier="auth-utils" type="application/vnd.ant.code" language="typescript" title="Authentication Utilities">
import { getServerSession } from "next-auth/next"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "./mongodb"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
}

export const getAuthSession = () => getServerSession(authOptions)