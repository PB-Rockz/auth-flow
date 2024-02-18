import { db } from "@/lib/db";  
export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verifcationToken = await db.verificationToken.findFirst({
            where:{
                email
            }
        })
        return verifcationToken;
    } catch (error) {
        return null;
    }
}
export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verifcationToken = await db.verificationToken.findUnique({
            where:{
                token
            }
        })
        return verifcationToken;
    } catch (error) {
        return null;
    }
}