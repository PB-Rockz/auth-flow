"use server";
import * as z from "zod"
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { 
    generateVerficationToken ,
    generateTwoFactorToken  
} from "@/lib/tokens";
import { 
    sendVerficationEmail,
    sendTwoFactorEmail
} from "@/lib/mail";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/twoFactorToken";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/twoFactorConfirmation";


export const login = async(values:z.infer<typeof LoginSchema> , callbackUrl?:string | null)=>{
    const validatedFields = LoginSchema.safeParse(values);
    if(!validatedFields.success){
        return {
            error:"Invalid Fields!"
        }
    }

    const {email,password , code} = validatedFields.data;
    const existingUser = await getUserByEmail(email);
    if( !existingUser?.password || !existingUser.email){
        return { error: "Email does not exist!"};
    }
    if(!existingUser.emailVerified){
        const verifcationToken = await generateVerficationToken(existingUser.email);
        await sendVerficationEmail(verifcationToken.email, verifcationToken.token);
        return { success: "Confirmation Email Sent! Please verify your email to login!"}
    }

    if(existingUser.isTwoFactorEnabled && existingUser.email){

        if(code){
            // TODO: Verify the code
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
            if(!twoFactorToken){
                return { error: "Invalid Code!"}
            }
            if(twoFactorToken.token !== code){
                return { error: "Invalid Code!"}
            }
            if(twoFactorToken.expires < new Date()){
                return { error: "Code Expired!"}
            }

            await db.twoFactorToken.delete({
                where:{
                    id:twoFactorToken.id
                }
            
            })

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
            if(existingConfirmation){
                await db.twoFactorConfirmation.delete({
                    where:{
                        id:existingConfirmation.id
                    }
                })
            }

            await db.twoFactorConfirmation.create({
                data:{
                    userId:existingUser.id
                }
            })
            
        }
        else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);
    
            return { twoFactor : true}
        }
    }

    try {
        await signIn("credentials" , {
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
        })
    } catch (error) {
        if(error instanceof AuthError){
            switch (error.type){
                case "CredentialsSignin" : return { error: "Invalid Credentials!"};
                default: return { error : "Something went wrong!"}
            }
        }

        throw error;
    }
}