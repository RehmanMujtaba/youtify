// pages/api/auth/callback.js
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Youtube({
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
