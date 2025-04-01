import React from "react";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";

export default function Navbar() {
  return (
    <div className="bg-[#183B4E] w-full h-fit p-4 rounded-2xl flex items-center justify-between">
      <div className="w-fit h-fit flex items-center gap-2">
        <Image
          className="rounded-full"
          src={'/img/profile-pic1.png'}
          alt="profile pic"
          width={44}
          height={44}
          priority
        />

        <div className="w-fit h-fit flex flex-col">
            <h6 className="font-sans font-medium text-xl">Mokey D. Luffy</h6>
            <p className="font-sans font-semibold text-xs text-[#008000]">Online</p>
        </div>
      </div>
      
      <button className="w-fit h-fit">
        <EllipsisVertical className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
