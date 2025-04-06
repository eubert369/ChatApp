import React, { useContext, useEffect } from "react";
import Image from "next/image";
import { Context } from "@/components/ContextProvider";

export default function Chats() {
  const context = useContext(Context);

  if (!context) {
    throw new Error("ChildComponent must be used within a ContextProvider");
  }

  useEffect(() => {
    console.log("context", context);
  }, [context]);

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
