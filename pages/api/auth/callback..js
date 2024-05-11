// pages/api/auth/callback.js
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    Google({
      clientId: process.env.YOUTUBE_CLIENT_ID,
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn(user, account) {
      if (account.provider === 'youtube' && user) {
        user.accessToken = account.accessToken;
        return true;
      }
      return false;
    }
  }
});
