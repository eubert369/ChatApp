import React from "react";
import Image from "next/image";
import Link from "next/link";
import { contactTypes } from "./Types";
import { Dot } from "lucide-react";
import moment from "moment";

export default function Contacts({
  contactId,
  imgSrc,
  name,
  latestMessage,
  selected,
  timestamp,
}: contactTypes) {
  return (
    <Link
      href={`/chats/${contactId}`}
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
        <div className="w-full h-fit flex items-center justify-start">
          <p className="font-sans font-normal text-xs text-white">
            {latestMessage.length > 24
              ? `${latestMessage.substring(0, 24)}...`
              : latestMessage}{" "}
          </p>
          <div className="w-fit h-fit flex gap-[2px] items-center">
            <Dot className="text-xs w-4 h-4" />
            <span className="font-sans font-normal text-xs text-white">
              {moment(new Date(timestamp)).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
