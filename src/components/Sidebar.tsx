import React from "react";
import { EllipsisVertical, Search } from "lucide-react";
import Contacts from "./Contacts";

export default function Sidebar() {
  return (
    <div className="bg-[#183B4E] w-fit max-w-[420px] h-full rounded-2xl flex flex-col">
      <div className="w-full h-fit px-6 py-5 flex flex-col gap-4">
        <div className="w-full h-fit flex justify-between items-center">
          <h4 className="font-sans font-semibold text-white text-2xl">Chats</h4>
          <button className="w-fit h-fit">
            <EllipsisVertical className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="bg-[#F5EEDC] w-full h-fit px-3 py-2 flex items-center gap-2 rounded-[8px]">
          <Search className="text-[#183B4E] w-5 h-5" />
          <input
            type="text"
            id="#"
            className="text-base text-[#183B4E] focus:outline-none"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="px-2 w-full h-full flex flex-col overflow-y-hidden">
        <Contacts
          imgSrc="/img/profile-pic1.png"
          name="Lorem Ipsum"
          lastMessage="Lorem: Hey"
          selected
        />
        <Contacts
          imgSrc="/img/profile-pic2.png"
          name="Lorem Ipsum"
          lastMessage="Lorem: Hey"
        />
        <Contacts
          imgSrc="/img/profile-pic3.png"
          name="Lorem Ipsum"
          lastMessage="Lorem: Hey"
        />
        <Contacts
          imgSrc="/img/profile-pic4.png"
          name="Lorem Ipsum"
          lastMessage="Lorem: Hey"
        />
      </div>
    </div>
  );
}
