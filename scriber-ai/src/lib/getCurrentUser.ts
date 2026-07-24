import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getCurrentUser(): Promise<string> {
    const cookieStore = await cookies();

    const token = cookieStore.get('token')?.value || cookieStore.get('Token')?.value;

    if (!token) throw new Error("Token not found");

    const decode = verifyToken(token);

    if (!decode || !decode.userId) throw new Error("unauthorized");

    return decode.userId;
}