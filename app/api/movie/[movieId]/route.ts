import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ movieId: string }> },
) {
  try {
    const { movieId } = await params;

    if (!movieId) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    const movie = await db.tMDBMovie.findUnique({
      where: {
        id: movieId,
      },
    });

    if (!movie) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
