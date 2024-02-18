import NextAuth  from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "@/auth.config"
import { db } from "@/lib/db"
import { getUserByID } from "@/data/user"
import { UserRole } from "@prisma/client"

import { getTwoFactorConfirmationByUserId } from "@/data/twoFactorConfirmation"
import { getAccountByUserId } from "./data/account"


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages:{
    signIn:"/auth/login",
    error: "/auth/error"
  },
  events:{
    async linkAccount({user}){
      await db.user.update({
        where:{id: user.id},
        data:{ emailVerified: new Date()}
      })
    }
  },
  callbacks:{
    async signIn({user , account}){

      // Allow OAuth accounts to sign in without verification
      if(account?.provider !== "credentials") return true;
      const existingUser = await getUserByID(user.id!);

      // Prevent users from signing in if their email is not verified
      if(!existingUser || !existingUser.emailVerified) return false;
      
      // 2FA logic goes here
      if(existingUser.isTwoFactorEnabled){
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        
        if(!twoFactorConfirmation) return false;

        // Delete the two factor confirmation after it's used
        await db.twoFactorConfirmation.delete({
          where:{
            id: twoFactorConfirmation.id
          }
        
        })
      }

      return true;
    },
    async session({token,session}){
      if(token.sub && session.user){
        session.user.id = token.sub;
      }  

      if(token.role && session.user){
        session.user.role = token.role as UserRole;
      }

      if(session.user ){
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      if(token.isTwoFactorEnabled && session.user){
        session.user.isTwoFactorEnabled = token.role as boolean;
      }
      return session;
    },
    async jwt({token}){
      if(!token.sub) return token;

      const existingUser = await getUserByID(token.sub);
      if(!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.role = existingUser.role;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: {strategy:"jwt"},
  ...authConfig,
})