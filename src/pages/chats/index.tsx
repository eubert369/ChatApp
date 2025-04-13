import React, { useContext, useEffect } from "react";
import Image from "next/image";
import { Context } from "@/components/ContextProvider";
import { useRouter } from "next/router";

export default function Chats() {
  const router = useRouter();
  const context = useContext(Context);

  if (!context) {
    throw new Error("ChildComponent must be used within a ContextProvider");
  }

  useEffect(() => {
    const validateUser = async () => {
      try {
        const req = await fetch("/api/users/profile");
        if (req.status === 200) {
          const user = await req.json();
          context.setUser(user);
          context.setInitialized(true);
          context.setLoggedIn(true);
        } else {
          const logout = await fetch("/api/logout", {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          });

          if (logout.status === 200) {
            context.setLoggedIn(false);
            router.push("/");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (!context.initialized) {
      validateUser();
    }
  }, [context, router]);

  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-3">
      <div className="relative w-2/3 h-2/3">
        <Image
          src={"/img/group-people-chatting.png"}
          alt="Icon"
          sizes="100"
          fill
          priority
        />
      </div>
      <h3 className="font-sans text-2xl text-[#183B4E]">
        No Selected Conversation
      </h3>
    </div>
  );
}
