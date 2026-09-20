import { NextRequest ,NextResponse} from "next/server";
import { prisma } from "../../../lib/prisma";
import { compare } from "bcryptjs";


export async function POST(request : NextRequest)
 {
 const body = await request.json();
 console.log("Request body:", body);
// email validation
 if (body.email== null){
    return NextResponse.json(
        { error: "Email is required" }, 
        { status: 400 });
 }




 
 // match the request email and password
const user = await prisma.user.findFirst(
    {
            where: {
                email: body.email,
                password: body.password,
            },
        }
    );
    
 

    if (user==null) {
        return NextResponse.json(
            { error: "User not found" }, 
            { status: 401 });

    }


const isPasswordValid = await compare(body.password, user.password);

if(isPasswordValid){
    return NextResponse.json(
        { message: "Login successful" }, 
        { status: 200 }
    )
}else{
    return NextResponse.json(
        { error: "Invalid password" }, 
        { status: 401 }
    )   
}
 }



    
