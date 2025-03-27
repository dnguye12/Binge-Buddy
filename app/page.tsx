"use client";

import { syncUser } from "@/lib/syncUser";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "sonner";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [checkedUser, setCheckedUser] = useState(false)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect("/sign-in");
    } else if (isLoaded && isSignedIn && checkedUser) {
      toast("Logged in successfully.");
      redirect("/conversation");
    }
  }, [isLoaded, isSignedIn, checkedUser]);

  useEffect(() => {
    if (user && !checkedUser) {
      const checkUser = async () => {
        try {
          await syncUser();
          setCheckedUser(true)
        } catch (error) {
          console.log(error);
          setCheckedUser(true)
        }
      };

      checkUser();
    }
  }, [user, checkedUser]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <div className="p-4 pt-2 text-red-500">{user.fullName}</div>;
}
