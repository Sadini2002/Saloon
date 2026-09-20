import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { compare } from "bcryptjs";
import * as jose from "jose";

export async function POST(request: NextRequest) {
    const body = await request.json();

    console.log("Request body:", body);

    // Email validation
    if (body.email == null) {
        return NextResponse.json(
            { error: "Email is required" },
            { status: 400 }
        );
    }

    // Find user by email
    const user = await prisma.user.findFirst({
        where: {
            email: body.email,
        },
    });

    // User not found
    if (user == null) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 401 }
        );
    }

    // Compare password
    const isPasswordValid = await compare(
        body.password,
        user.password
    );

    if (isPasswordValid) {

        const secretText = process.env.JOSE_SECRET;

        if (!secretText) {
            return NextResponse.json(
                { error: "JOSE_SECRET is not configured" },
                { status: 500 }
            );
        }

        const secret = new TextEncoder().encode(secretText);

        // Create JWT
        const token = await new jose.SignJWT({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            privileges: user.privileges,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("2h")
            .sign(secret);

        console.log("Generated JWT token:", token);

        // Create response
        const response = NextResponse.json(
            {
                message: "Login successful",
                role: user.role,
            },
            { status: 200 }
        );

        // Set cookie
        response.cookies.set({
            name: "logintoken",
            value: token,
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 60 * 60 * 2,
        });

        return response;

    } else {

        return NextResponse.json(
            { error: "Invalid password" },
            { status: 401 }
        );

    }
}