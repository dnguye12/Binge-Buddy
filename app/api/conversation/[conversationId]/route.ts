import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ conversationId: string }> }) {
    try {
      const { conversationId} = await params
  
      if(!conversationId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const conversation = await db.conversation.findUnique({
        where: {
          id: conversationId
        },
        include: {
          users: true,
          messages: {
            include: {
              sender: true, 
              seen: true
            }
          }
        }
      })
  
      return NextResponse.json(conversation)
    }catch(error) {
      console.log(error)
      return new NextResponse("Internal Error", { status: 500 })
    }
  }