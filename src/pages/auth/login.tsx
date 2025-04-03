import React, { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const formSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const req = await fetch("/api/login", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const res = await req.json();
      console.log("response", res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#183B4E] w-full h-screen overflow-y-auto flex justify-center items-center">
      <form onSubmit={formSubmit} className="bg-[#F5EEDC] w-1/3 h-fit px-6 py-5 rounded-[12px] flex flex-col gap-8">
        <h3 className="font-sans font-bold text-[32px] text-[#183B4E] text-center">
          Login
        </h3>

        <div className="w-full h-fit flex flex-col gap-2">
          <div className="w-full h-fit flex flex-col gap-1">
            <label
              htmlFor="username"
              className="font-sans font-normal text-base text-[#183B4E]"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#F5EEDC] focus:outline-none border border-[#183B4E] rounded-[8px] px-3 py-2 text-base text-[#183B4E]"
            />
          </div>

          <div className="w-full h-fit flex flex-col gap-1">
            <label
              htmlFor="password"
              className="font-sans font-normal text-base text-[#183B4E]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#F5EEDC] focus:outline-none border border-[#183B4E] rounded-[8px] px-3 py-2 text-base text-[#183B4E]"
            />
          </div>
        </div>

        <div className="w-full h-fit flex flex-col gap-3">
          <button
            type="submit"
            onClick={() => router.push("/chats")}
            className="w-full h-fit py-2 rounded-[8px] bg-[#27548A] border border-[#27548A] font-sans font-bold text-base text-white hover:bg-[#F5EEDC] hover:text-[#27548A] cursor-pointer"
          >
            Login
          </button>
          <button className="w-full h-fit py-2 rounded-[8px] border border-[#27548A] font-sans font-bold text-base text-[#27548A] bg-[#F5EEDC] hover:text-[#27548A] cursor-pointer flex items-center justify-center gap-2">
            <i>
              <Image
                src={"/icons/google-icon.svg"}
                alt="google icon"
                width={16}
                height={16}
              />
            </i>
            Continue with Google
          </button>
          <p className="font-sans font-normal text-xs text-[#183B4E] text-center">
            Don&apos;t have an Account?{" "}
            <Link href={"/auth/signup"} className="hover:font-bold">
              Signup
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
