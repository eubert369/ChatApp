import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import GoogleAuthBtn from "@/components/GoogleAuthBtn";
import LoadingComponent from "@/components/LoadingComponent";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setpassword] = useState<string>("");

  const formSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      const req = await fetch("/api/signup", {
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
        setLoading(false);
      } else {
        setErrorMessage(res.message);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#183B4E] w-full h-screen flex justify-center items-center">
      <form
        onSubmit={formSubmit}
        className="bg-[#F5EEDC] w-1/3 h-fit px-6 py-5 rounded-[12px] flex flex-col gap-5"
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
          {/* <button className="w-full h-fit py-2 rounded-[8px] border border-[#27548A] font-sans font-bold text-base text-[#27548A] bg-[#F5EEDC] hover:text-[#27548A] cursor-pointer flex items-center justify-center gap-2">
            <i>
              <Image
                src={"/icons/google-icon.svg"}
                alt="google icon"
                width={16}
                height={16}
              />
            </i>
            Continue with Google
          </button> */}
          <p className="font-sans font-normal text-xs text-[#27548A] text-center">
            Already have an Account?{" "}
            <Link href={"/auth/login"} className="hover:font-bold">
              Login
            </Link>
          </p>
        </div>
      </form>
      {loading && <LoadingComponent />}
    </div>
  );
}
