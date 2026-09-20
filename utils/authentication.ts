import { NextRequest } from "next/server";
import * as jose from "jose";
import { jwtVerify } from "jose";



export async function GetUser(request: NextRequest) {
    const logintoken = request.cookies.get("loginToken")?.value; 
        const secretText = process.env.JOSE_SECRET;  
        const secret = new TextEncoder().encode(secretText);

    try{

    const user = await jose.jwtVerify(
        logintoken ||"",
        secret
    )
}catch{
    return null
}



}