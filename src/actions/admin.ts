"use server";
import { UserRole } from "@prisma/client";
import { CurrentRole } from "@/lib/auth";

export async function admin() {
    const role = await CurrentRole();

    if (role === UserRole.ADMIN) {
        return {success: "Allowed"}
    }
    return {error: "Forbidden"}
}