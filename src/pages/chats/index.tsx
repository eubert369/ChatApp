import React, { useContext, useEffect } from "react";
import Image from "next/image";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Context } from "@/components/ContextProvider";
import { userTypes } from "@/components/Types";

interface ssrProps {
  currentUser: userTypes;
}

const emptyUserProps: userTypes = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  imgUrl: "",
};

export const getServerSideProps = (async ({ req }) => {
  try {
    const token = req.headers.cookie;
    if (token) {
      const decodedToken = JSON.parse(decodeURIComponent(token.split("=")[1]));
      const protocol = req.headers["x-forwarded-proto"];
      const origin: string = `${protocol}://${req.headers.host}`;

      const request = await fetch(`${origin}/api/users/${decodedToken.id}`);
      const response = await request.json();
      console.log("response", response);

      return {
        props: {
          currentUser: response,
        },
      };
    } else {
      return {
        props: {
          currentUser: emptyUserProps,
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      props: {
        currentUser: emptyUserProps,
      },
    };
  }
}) satisfies GetServerSideProps<ssrProps>;

export default function Chats({
  currentUser,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const context = useContext(Context);

  if (!context) {
    throw new Error("ChildComponent must be used within a ContextProvider");
  }

  useEffect(() => {
    context.setUser(currentUser);
    console.log("useContext()", context.user);
  }, [context, currentUser]);

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
