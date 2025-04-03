import React from "react";
import Image from "next/image";

export default function Chats() {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-3">
      <div className="relative w-2/3 h-2/3">
        <Image
          src={"/img/group-people-chatting.png"}
          alt="Icon"
          fill
          priority
        />
      </div>
      <h3 className="font-sans text-2xl text-[#183B4E]">No Selected Conversation</h3>
    </div>
  );
}
