import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Signup() {
  return (
    <div className="bg-[#183B4E] w-full h-screen flex justify-center items-center">
      <div className="bg-[#F5EEDC] w-1/3 h-fit px-6 py-5 rounded-[12px] flex flex-col gap-5">
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
              type="text"
              id="firstName"
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
              type="text"
              id="lastName"
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
              type="email"
              id="email"
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
              type="text"
              id="username"
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
              type="password"
              id="password"
              className="border border-[#183B4E] rounded-[8px] px-3 py-2 text-base text-[#183B4E] focus:outline-none"
            />
          </div>
        </div>

        <div className="w-full h-fit flex flex-col gap-3">
          <button
            type="submit"
            className="w-full h-fit py-2 rounded-[8px] bg-[#27548A] border border-[#27548A] font-sans font-bold text-base text-white hover:bg-[#F5EEDC] hover:text-[#27548A] cursor-pointer"
          >
            Create Account
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
          <p className="font-sans font-normal text-xs text-[#27548A] text-center">
            Already have an Account?{" "}
            <Link href={"/auth/login"} className="hover:font-bold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
