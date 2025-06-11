import React from "react";
import Image from "next/image";
import { EllipsisVertical, UserMinus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Skeleton } from "./ui/skeleton";

export default function Navbar({
  withSelectedConvo,
  contactName,
  imgUrl,
}: {
  withSelectedConvo?: boolean;
  contactName?: string;
  imgUrl?: string;
}) {
  return (
    <div
      className={`bg-[#183B4E] w-full h-fit p-4 rounded-2xl flex items-center ${
        withSelectedConvo ? "justify-between" : "justify-end"
      }`}
    >
      {withSelectedConvo && (
        <div className="w-fit h-fit flex items-center gap-3">
          {imgUrl !== undefined ? (
            <Image
              className="rounded-full"
              src={imgUrl}
              alt="profile pic"
              width={44}
              height={44}
              priority
            />
          ) : (
            <Skeleton className="w-11 h-11 rounded-full" />
          )}

          <div className="w-fit h-fit flex flex-col">
            {imgUrl !== undefined ? (
              <h6 className="font-sans font-medium text-xl">{contactName}</h6>
            ) : (
              <Skeleton className="w-36 h-4 rounded-md" />
            )}

            {/* <p className="font-sans font-semibold text-xs text-[#008000]">
              Online
            </p> */}
          </div>
        </div>
      )}

      <Popover>
        <PopoverTrigger className="cursor-pointer">
          <EllipsisVertical className="w-6 h-6 text-white" />
        </PopoverTrigger>
        <PopoverContent className="bg-[#F5EEDC] w-fit h-fit p-0 flex flex-col gap-1 py-2 border border-[#183B4E] rounded-md">
          <button className="px-3 py-1 flex gap-2 items-center font-sans font-medium text-start cursor-pointer text-[#183B4E] hover:bg-gray-600/15">
            <UserMinus className="w-4 h-4" />
            Remove Contact
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
