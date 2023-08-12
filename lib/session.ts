//儲存目前登入的使用者資料
import { getServerSession } from "next-auth";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from 'next-auth/providers/google';
import jsonwebtoken from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt'; 
import { SessionInterface, UserProfile} from "@/common.types";
import { createUser, getUser } from "./actions";
import { log } from "console";

export const authOptions: NextAuthOptions = {
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    jwt:{
        encode: ({ secret, token}) =>{
            const encodedToken = 
            jsonwebtoken.sign({
                ...token,
                iss: 'grafbase',
                exp: Math.floor(Date.now() / 1000) + 60*60
            }, secret)
            return encodedToken
        },
        decode: async ({secret, token}) =>{
            const decodedToken = 
            jsonwebtoken.verify(token!, secret) as JWT;
            return decodedToken
        }
    },
    theme:{
        colorScheme:'light',
        logo:'./logo.png'
    },
    callbacks:{
        async session({ session }){
        // Triggered everytime user visit the page, start a new session for the user
            const email = session?.user?.email as string;
            try {
                const data = await getUser(email) as { user?: UserProfile}; 
                //取得不只google info but projects, description, linkedInUrl, githubUrl, ...
                const newSession ={
                    ...session,
                    user:{
                        ...session.user,
                        ...data?.user
                    }
                }
                return newSession;
            } catch (error) {
                console.log('Error retrieving user data',error);
                return session;
            }
        },
        //Specifty the user types: Google user and the user from the database
        async signIn({  user }: { user : AdapterUser | User}){
            try{
                // get the user from the database if they exist;
                // getUser function is from lib action.ts 
                const userExists = await getUser(user?. email as string ) as {user ?: UserProfile}
                
                // create them ,if they don't exist
                if(!userExists.user){
                    await createUser(user.name as string, user.email as string, user.image as string ); 
                }
                return true
            } catch (error: any){
                console.log(error);
                return false;
            }
        } 
    }
}

export async function getCurrentUser(){
    const session = await getServerSession(authOptions)
    ; //user login info
    return session;
}
