import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Send } from "lucide-react";
import ChatItem from "@/components/ChatItem";
import Navbar from "@/components/Navbar";
import { Context } from "@/components/ContextProvider";
import {
  chatItemTypes,
  contactInfoTypes,
  allMessageResponseTypes,
} from "@/components/Types";
import { db } from "@/components/firebase/Config";
import { onSnapshot, collection, query, where } from "firebase/firestore";

export default function ChatMate() {
  const router = useRouter();
  const context = useContext(Context);
  const { id } = router.query;
  const [textareaFocused, setTextareaFocused] = useState<boolean>(false);
  const [chats, setChats] = useState<chatItemTypes[]>([]);
  const [message, setMessage] = useState<string>("");
  const [contactInfo, setContactInfo] = useState<contactInfoTypes>();

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
    if (!router.isReady) return;

    const fetchContact = async () => {
      try {
        const req = await fetch(`/api/users/contact/${id}`);
        const res = (await req.json()) as contactInfoTypes;
        console.log("contact:", res);

        setContactInfo(res);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAllMessages = async () => {
      try {
        const req = await fetch(`/api/messages/${id}`);
        if (req.status === 200) {
          const res = await req.json();
          const mappedMessages = res.map((doc: allMessageResponseTypes) => {
            return {
              ...doc,
              profilePicUrl: contactInfo?.imgUrl,
            };
          });
          const sortedMessages = mappedMessages.sort(
            (a: allMessageResponseTypes, b: allMessageResponseTypes) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          console.log("all messages response:", sortedMessages);
          setChats(sortedMessages);
        }
      } catch (error) {
        console.error(error);
      }
    };

    try {
      const unsubscribe = onSnapshot(
        query(collection(db, "messages"), where("convoId", "==", id)),
        () => {
          fetchContact();
          fetchAllMessages();
        }
      );
      return () => unsubscribe();
    } catch (error) {
      console.info(error);
    }
  }, [
    id,
    context.currentUserId,
    context.user.imgUrl,
    contactInfo?.imgUrl,
    router.isReady,
  ]);

  const sendMessage = async () => {
    try {
      const request = await fetch("/api/messages/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          convoId: id,
          message: message,
          recipientId: contactInfo?.userId,
          date: `${new Date()}`,
        }),
      });

      const response = await request.json();

      console.log("send message response", response);
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar
        withSelectedConvo={true}
        contactName={contactInfo?.name}
        imgUrl={contactInfo?.imgUrl}
      />

      <div className="w-full h-full overflow-y-auto flex flex-col-reverse gap-3">
        {chats.map((chat, chatId) => (
          <ChatItem
            key={chatId}
            message={chat.message}
            received={chat.received}
            profilePicUrl={`${contactInfo?.imgUrl}`}
          />
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="w-full h-fit flex gap-2 px-4 py-3 rounded-2xl border border-[#183B4E]"
      >
        <textarea
          id="#"
          rows={textareaFocused ? 2 : 1}
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          onFocus={() => setTextareaFocused(true)}
          onBlur={() => setTextareaFocused(false)}
          onKeyUp={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
            setMessage(e.currentTarget.value);
          }}
          className="w-full h-fit text-[#183B4E] focus:outline-none resize-none"
          placeholder="Aa ..."
        ></textarea>
        <button type="submit" className="w-fit h-fit cursor-pointer">
          <Send className="w-6 h-6 text-[#183B4E]" />
        </button>
      </form>
    </>
  );
}
