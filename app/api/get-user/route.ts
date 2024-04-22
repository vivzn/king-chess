//add a sessionID in the text to ignore the sender who sent
import connectDB from "@/lib/connectDB"
import { pusherServer } from "@/pusherConfig"
import user from "@/models/User"
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectDB();
    const { email } = await req.json()
    const data = await user.findOne({ email }).exec();

    return NextResponse.json(data);
}