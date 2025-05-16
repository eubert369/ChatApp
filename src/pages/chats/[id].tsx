import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Send } from "lucide-react";
import ChatItem from "@/components/ChatItem";
import { Context } from "@/components/ContextProvider";
import { chatItemTypes } from "@/components/Types";
import { db } from "@/components/firebase/Config";
import { onSnapshot, collection, query, where } from "firebase/firestore";

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
  const context = useContext(Context);
  const { id } = router.query;
  const [textareaFocused, setTextareaFocused] = useState<boolean>(false);
  const [chats, setChats] = useState<chatItemTypes[]>([]);

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
          context.setCurrentUserId(user.id);
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
    } else {
      if (context.user.imgUrl === "" || context.user.imgUrl === undefined) {
        console.log("Profile pic not initiated");
      }
    }
  }, [context, router]);

  useEffect(() => {
    onSnapshot(
      query(collection(db, "messages"), where("convoId", "==", id)),
      (snapshot) => {
        const filteredSnapshots = snapshot.docChanges().map((message) => {
          return {
            message: message.doc.data().messageContent,
            received:
              message.doc.data().recipientId == context.currentUserId
                ? true
                : false,
            profilePicUrl:
              message.doc.data().recipientId == context.currentUserId
                ? "/img/profile-pic1.png"
                : context.user.imgUrl,
          };
        });

        console.log("snapshot:", filteredSnapshots);
        setChats(filteredSnapshots);
      }
    );
  }, [id, context.currentUserId, context.user.imgUrl]);

  return (
    <>
      <div className="w-full h-full overflow-y-auto flex flex-col-reverse gap-3">
        {chats.map((chat, chatId) => (
          <ChatItem
            key={chatId}
            message={chat.message}
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
