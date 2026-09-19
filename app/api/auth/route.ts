import { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";


export async function POST(request : NextRequest)
 {
 const body = await request.json();
 console.log("Request body:", body);


 // match the request email and password
const user = await prisma.user.findFirst(
    {
            where: {
                email: body.email,
                password: body.password,
            },
        }
    );
    console.log("User found:", user);

    }



 