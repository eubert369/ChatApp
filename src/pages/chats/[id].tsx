import { useRouter } from "next/router";
import React, { useState } from "react";
import { Send } from "lucide-react";
import ChatItem from "@/components/ChatItem";
import { chatItemTypes } from "@/components/Types";

const rawChats: chatItemTypes[] = [
  {
    message: "Okay",
    received: false,
    profilePicUrl: "/img/profile-pic1.png",
  },
  {
    message:
      "The Big brown fox jumps over the lazy dog. The Big brown fox jumps over the lazy dog. The Big brown fox jumps over the lazy dog.",
    received: true,
    profilePicUrl: "/img/profile-pic1.png",
  },
  {
    message:
      "The Big brown fox jumps over the lazy dog. The Big brown fox jumps over the lazy dog. The Big brown fox jumps over the lazy dog.",
    received: false,
    profilePicUrl: "/img/profile-pic1.png",
  },
  {
    message: "The Big brown fox jumps over the lazy dog",
    received: true,
    profilePicUrl: "/img/profile-pic1.png",
  },
  {
    message: "Hello",
    received: false,
    profilePicUrl: "/img/profile-pic1.png",
  },
  {
    message: "Hi",
    received: true,
    profilePicUrl: "/img/profile-pic1.png",
  },
];

export default function ChatMate() {
  const router = useRouter();
  const { id } = router.query;
  const [textareaFocused, setTextareaFocused] = useState<boolean>(false);

  return (
    <>
      <div className="w-full h-full overflow-y-auto flex flex-col-reverse gap-3">
        {rawChats.map((chat, chatId) => (
          <ChatItem
            key={chatId}
            message={`${chat.message} ${id}`}
            received={chat.received}
            profilePicUrl={chat.profilePicUrl}
          />
        ))}
      </div>

      <form
        onSubmit={() => alert("test submit")}
        className="w-full h-fit flex gap-2 px-4 py-3 rounded-2xl border border-[#183B4E]"
      >
        <textarea
          id="#"
          rows={textareaFocused ? 2 : 1}
          onFocus={() => setTextareaFocused(true)}
          onBlur={() => setTextareaFocused(false)}
          className="w-full h-fit text-[#183B4E] focus:outline-none resize-none"
          placeholder="Aa ..."
        ></textarea>
        <button type="submit" className="w-fit h-fit">
          <Send className="w-6 h-6 text-[#183B4E]" />
        </button>
      </form>
    </>
  );
}
