"use client";

import { syncUser } from "@/lib/syncUser";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect } from "react";

import { toast } from "sonner";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect("/sign-in");
    } else if (isLoaded && isSignedIn) {
      toast("Logged in successfully.");
      redirect("/users");
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (user) {
      const checkUser = async () => {
        try {
          await syncUser();
        } catch (error) {
          console.log(error);
        }
      };

      checkUser();
    }
  }, [user]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <div className="p-4 pt-2 text-red-500">{user.fullName}</div>;
}
