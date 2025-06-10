import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { User, Account, Profile } from 'next-auth';
import authService from '@/services/authService';
// import cookieService from '@/services/jwtService';


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          access_type: 'offline', 
          prompt: 'consent', 
        },
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }: { token: any; account?: any; user?: any }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.provider = account.provider; 
        token.providerId = account.id;
        token.exp = account.expires_at || Math.floor(Date.now() / 1000) + 3600;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id || token.sub; // Use custom ID or fallback to token.sub
        session.accessToken = token.accessToken; // Access token
        session.refreshToken = token.refreshToken; // Refresh token
        session.provider = token.provider; // OAuth provider
        session.providerId = token.providerId; // Unique ID from OAuth provider
        session.expires = token.exp ? new Date(token.exp * 1000).toISOString() : null;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log("NextAuth redirect:", { url, baseUrl });
      
      // After successful sign in, redirect to the success page
      if (url.startsWith(baseUrl)) {
        console.log("Redirecting to success page");
        return `${baseUrl}/auth/success`;
      }
      
      console.log("Redirecting to:", url);
      return url;
    }
  },

  events: {
    async signIn(params: { 
      user: User; 
      account: Account | null; 
      profile?: Profile; 
      isNewUser?: boolean 
    }) {
      const { user, account } = params;
      if (user && account) {
        const { email, name, image } = user;
        authService.exists(email || "")
        .then((response) => {
          console.log("User exists response:", response);
          const userData = {
            name: name || "",
            email: email || "",
            image_url: image || "",
            oauth_provider: account.provider,
            oauth_provider_id: account.id as string,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            subscription_plan: "free",
          }
          // If the user already exists, update the user data
          if (response.exists) {
            console.log("User already exists");
            return authService.update(userData, email || "");
          // If the user does not exist, create a new user
          } else {
            return authService.signup(userData);
          }
        })
        .then(() => {
          // Sync extension data after sign in
          return authService.extensionSync({
              email: user.email || "",
              name: user.name || "",
              extensionId: "your-extension-id", // Replace with your actual extension ID
              instanceId: "your-instance-id" // Replace with your actual instance ID
            })  
        })
        .then((response) => {
          console.log("Extension sync successful", response);
          // cookieService.setUser(response.user);
          // cookieService.setAccessToken(response.accessToken);
          // cookieService.setRefreshToken(response.refreshToken);
        })
        .catch((error) => {
          console.error("Error checking if user exists:", error);
        } );     
      }
    }
  },
 
  pages: {
    signIn: '/signin',
    error: '/error',
    signOut: '/signout'
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };