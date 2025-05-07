import React, { FormEvent, useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import GoogleAuthBtn from "@/components/GoogleAuthBtn";
import { Context } from "@/components/ContextProvider";
import { toast } from "sonner";

export default function Login() {
  const context = useContext(Context);

  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [invalidCredentials, setInvalidCredentials] = useState<boolean>(false);

  const formSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setInvalidCredentials(false);
      const loadingID = toast.loading("Logging in");
      const req = await fetch("/api/auth/login", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (req.status === 200) {
        const res = await req.json();
        context?.setUser(res.user);
        context?.setLoggedIn(true);
        toast.success("Loggedin successfully", { id: loadingID });
        console.log("success", res, router.pathname);

        router.push("/chats");
      } else {
        toast.error("Invcorrect username or password", { id: loadingID });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#183B4E] w-full h-screen overflow-y-auto flex justify-center items-center">
      <form
        onSubmit={formSubmit}
        className="bg-[#F5EEDC] w-1/3 h-fit px-6 py-5 rounded-[12px] flex flex-col gap-8"
      >
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
              required
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
              required
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#F5EEDC] focus:outline-none border border-[#183B4E] rounded-[8px] px-3 py-2 text-base text-[#183B4E]"
            />
          </div>
        </div>

        <div className="w-full h-fit flex flex-col gap-3">
          {invalidCredentials && (
            <p className="text-base text-red-500 text-center">
              Incorrect Username or Password
            </p>
          )}
          <button
            type="submit"
            className="w-full h-fit py-2 rounded-[8px] bg-[#27548A] border border-[#27548A] font-sans font-bold text-base text-white hover:scale-105 cursor-pointer"
          >
            Login
          </button>
          <GoogleAuthBtn />

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
