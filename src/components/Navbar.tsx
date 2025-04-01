import React from "react";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

export default function Navbar({
  withSelectedConvo,
}: {
  withSelectedConvo?: boolean;
}) {
  return (
    <div
      className={`bg-[#183B4E] w-full h-fit p-4 rounded-2xl flex items-center ${
        withSelectedConvo ? "justify-between" : "justify-end"
      }`}
    >
      {withSelectedConvo && (
        <div className="w-fit h-fit flex items-center gap-2">
          <Image
            className="rounded-full"
            src={"/img/profile-pic1.png"}
            alt="profile pic"
            width={44}
            height={44}
            priority
          />

          <div className="w-fit h-fit flex flex-col">
            <h6 className="font-sans font-medium text-xl">Mokey D. Luffy</h6>
            <p className="font-sans font-semibold text-xs text-[#008000]">
              Online
            </p>
          </div>
        </div>
      )}

      <Popover>
        <PopoverTrigger className="cursor-pointer">
          <EllipsisVertical className="w-6 h-6 text-white" />
        </PopoverTrigger>
        <PopoverContent className="bg-[#F5EEDC] w-fit h-fit p-0 flex flex-col gap-1 py-2 border border-[#183B4E] rounded-md">
          <button className="px-3 py-1 flex gap-2 items-center font-sans font-medium text-start cursor-pointer text-[#183B4E] hover:bg-gray-600/15">
            Profile Settings
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
