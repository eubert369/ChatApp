import React from "react";
import Image from "next/image";
import { contactTypes } from "./Types";

export default function Contacts({
  imgSrc,
  name,
  lastMessage,
  selected,
}: contactTypes) {
  return (
    <button
      type="button"
      className={`${
        selected ? "bg-[#27548A]/25" : "hover:bg-white/15"
      } w-full h-fit px-2 py-2 flex gap-2 rounded-md`}
    >
      <Image
        className="rounded-full"
        src={imgSrc}
        alt="profile pic"
        width={56}
        height={56}
        priority
      />
      <div className="w-full h-fit flex flex-col text-start">
        <h6 className="font-sans font-normal text-lg text-white">{name}</h6>
        <p className="font-sans font-normal text-xs text-white">
          {lastMessage} . 32m
        </p>
      </div>
    </button>
  );
}
