import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  const user = await currentUser();

  console.log("womp")

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const existingUser = await db.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!existingUser) {
    const newUser = await db.user.create({
      data: {
        clerkId: user.id,
        name: user.username || user.fullName || "",
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl
      },
    });

    return NextResponse.json(newUser);
  }

  return NextResponse.json(existingUser);
}
