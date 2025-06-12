import React from "react";
import Image from "next/image";
import { chatItemTypes } from "./Types";
import { Skeleton } from "./ui/skeleton";

export default function ChatItem({
  message,
  received,
  profilePicUrl,
}: chatItemTypes) {
  return (
    <div className={`w-full h-fit flex gap-1 ${!received && "justify-end"}`}>
      {received && profilePicUrl !== undefined && (
        <Image
          className="rounded-full min-w-[28px] min-h-[28px] max-w-[28px] max-h-[28px]"
          src={profilePicUrl}
          alt="contact img"
          width={28}
          height={28}
        />
      )}

      {received && profilePicUrl == undefined && (
        <Skeleton className="w-[28px] h-[28px] rounded-full" />
      )}

      {profilePicUrl !== undefined ? (
        <div
          className={`${
            received ? "bg-[#27548A]" : "bg-[#DDA853]"
          } w-fit max-w-2/3 h-fit p-2 font-sans font-normal text-base text-white rounded-[8px]`}
        >
          {message}
        </div>
      ) : (
        <Skeleton className="w-1/3 h-6" />
      )}
    </div>
  );
}
