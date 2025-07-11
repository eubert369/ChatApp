import React from "react";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>LetsChat</title>
      </Head>
      <div className="w-full h-screen flex items-center justify-center bg-linear-to-br from-[#183B4E] via-white to-[#27548A]">
        <div className="w-fit h-fit flex flex-col items-center gap-14">
          <div className="w-fit h-fit text-center flex flex-col gap-1">
            <h1 className="text-[#183B4E] text-[56px] font-bold">
              Welcome User
            </h1>

            <p className="text-[#183B4E] text-[20px]">
              <Typewriter
                words={[
                  "Chat anyone you like",
                  "Your friends",
                  "Your loved ones",
                  "And everyone",
                ]}
                loop={false}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </p>
          </div>
          <div className="w-fit h-fit flex items-center gap-3">
            <Link
              href={"/auth/login"}
              className="bg-[#DDA853] rounded-sm text-white px-4 py-1 text-lg hover:scale-110"
            >
              Login
            </Link>
            <Link
              href={"/auth/signup"}
              className="bg-[#27548A] rounded-sm text-white px-4 py-1 text-lg hover:scale-110"
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
