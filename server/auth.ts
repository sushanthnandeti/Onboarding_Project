import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./db"
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"
import Credentials from "next-auth/providers/credentials"
import {users} from "./schema"
import { LoginSchema } from "@/types/login-schema"
  
export const { handlers, auth, signIn, signOut} = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
        authorize : async(credentials) => {
          const validatedFields = LoginSchema.safeParse(credentials)

          if (validatedFields.success) {
            const {email, password} = validatedFields.data;

            const user  = await db.query.users.findFirst({
              where : eq(users.email, email),
            })
            if (!user || !user.password) return null

            const passwordMatch = await bcrypt.compare(password, user.password)
            if(passwordMatch) return user
          }
          return null
        }
    })
  ],
  pages : {
    signIn : "/login"
  },
  secret : process.env.AUTH_SECRET,
  session : {
    strategy : "jwt"
  }
})