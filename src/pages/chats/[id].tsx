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
        const res = await req.json();
        setChats(
          res.map((doc: allMessageResponseTypes) => {
            return {
              ...doc,
              proflePicUrl: doc.received
                ? "/img/profile-pic1.png"
                : context.user.imgUrl,
            };
          })
        );
        console.log("all messages response:", res);
      } catch (error) {
        console.error(error);
      }
    };

    try {
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

          fetchAllMessages();

          console.log("snapshot:", filteredSnapshots);
          // setChats(filteredSnapshots);
        }
      );
      fetchContact();
    } catch (error) {
      console.info(error);
    }
  }, [id, context.currentUserId, context.user.imgUrl, contactInfo?.imgUrl]);

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
        }),
      });

      const response = await request.json();

      console.log("send message response", response);
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
            profilePicUrl={chat.profilePicUrl}
          />
        ))}
      </div>

      <form
        onSubmit={sendMessage}
        className="w-full h-fit flex gap-2 px-4 py-3 rounded-2xl border border-[#183B4E]"
      >
        <textarea
          id="#"
          rows={textareaFocused ? 2 : 1}
          onFocus={() => setTextareaFocused(true)}
          onBlur={() => setTextareaFocused(false)}
          onKeyUp={(e) => setMessage(e.currentTarget.value)}
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
