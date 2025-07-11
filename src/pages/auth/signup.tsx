import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import GoogleAuthBtn from "@/components/GoogleAuthBtn";
import { toast } from "sonner";
import Head from "next/head";
// import LoadingComponent from "@/components/LoadingComponent";

export default function Signup() {
  const router = useRouter();
  // const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setpassword] = useState<string>("");

  const formSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const loadingID = toast.loading("Creating account");
      const req = await fetch("/api/auth/signup", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          username: username,
          password: password,
        }),
      });
      const res = await req.json();

      if (req.status === 200) {
        router.push("/auth/login");
        toast.success("Account created successfully", { id: loadingID });
      } else {
        setErrorMessage(res.message);
        toast.error(res.message, { id: loadingID });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed creating your account");
    }
  };

  return (
    <>
      <Head>
        <title>Signup</title>
      </Head>
      <div className="bg-[#183B4E] px-3 w-full h-screen overflow-y-auto flex justify-center items-center sm:px-0">
        <form
          onSubmit={formSubmit}
          className="bg-[#F5EEDC] w-full h-fit px-6 py-2 rounded-[12px] flex flex-col gap-8 sm:w-1/3 "
        >
          <h3 className="font-sans font-bold text-[32px] text-[#183B4E] text-center">
            Signup
          </h3>

          <div className="w-full h-fit flex flex-col gap-2">
            <div className="w-full h-fit flex flex-col gap-1">
              <label
                htmlFor="firstName"
                className="font-sans font-normal text-base text-[#183B4E]"
              >
                First Name
              </label>
              <input
                required
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border border-[#183B4E] rounded-[8px] px-3 py-2 text-base text-[#183B4E] focus:outline-none"
              />
            </div>

            <div className="w-full h-fit flex flex-col gap-1">
              <label
                htmlFor="lastName"
                className="font-sans font-normal text-base text-[#183B4E]"
              >
                Last Name
              </label>
              <input
                required
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border border-[#183B4E] rounded-[8px] px-3 py-2 text-base text-[#183B4E] focus:outline-none"
              />
            </div>

            <div className="w-full h-fit flex flex-col gap-1">
              <label
                htmlFor="email"
                className="font-sans font-normal text-base text-[#183B4E]"
              >
                Email
              </label>
              <input
                required
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-[#183B4E] rounded-[8px] px-3 py-2 text-base text-[#183B4E] focus:outline-none"
              />
            </div>

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
                className="border border-[#183B4E] rounded-[8px] px-3 py-2 text-base text-[#183B4E] focus:outline-none"
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
                onChange={(e) => setpassword(e.target.value)}
                className="border border-[#183B4E] rounded-[8px] px-3 py-2 text-base text-[#183B4E] focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full h-fit flex flex-col gap-3">
            <p className="text-base text-red-500 text-center">{errorMessage}</p>
            <button
              type="submit"
              className="w-full h-fit py-2 rounded-[8px] bg-[#27548A] border border-[#27548A] font-sans font-bold text-base text-white hover:scale-105 cursor-pointer"
            >
              Create Account
            </button>
            <GoogleAuthBtn />
            <p className="font-sans font-normal text-xs text-[#27548A] text-center">
              Already have an Account?{" "}
              <Link href={"/auth/login"} className="hover:font-bold">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
