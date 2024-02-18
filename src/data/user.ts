import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
    try {     
        return await db.user.findUnique({
            where: {
            email,
            },
        });
    } catch (error) {
        return null
    }
}
export const getUserByID = async (id: string) => {
    try {     
        return await db.user.findUnique({
            where: {
            id,
            },
        });
    } catch (error) {
        return null
    }
}