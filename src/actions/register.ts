"use server";
import * as z from "zod"
import bycrypt from "bcryptjs";
import { db } from "@/lib/db";
import { ReigterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerficationToken } from "@/lib/tokens";
import {sendVerficationEmail} from "@/lib/mail";

export const register = async(values:z.infer<typeof ReigterSchema>)=>{
    const validatedFields = ReigterSchema.safeParse(values);
    if(!validatedFields.success){
        return {
            error:"Invalid Fields!"
        }
    }

    const {name,email,password} = validatedFields.data;
    const hashedPassword = await bycrypt.hash(password,10);

    const existiingUser = await getUserByEmail(email);

    if (existiingUser){
        return { error:"Email already in use!"}
    }

    await db.user.create({
        data:{
            name,
            email,
            password:hashedPassword
        }   
    })

    // TODO: Send email to user

    const verifcationToken = await generateVerficationToken(email);

    await sendVerficationEmail(verifcationToken.email,verifcationToken.token);
    return {
        success:"Confirmation Email Sent!"
    }
    
}