import React, { useContext } from "react";
import { EllipsisVertical, Search, LogOut, UserRound } from "lucide-react";
import Contacts from "./Contacts";
import { contactTypes } from "./Types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useRouter } from "next/router";
import { Context } from "./ContextProvider";

const listOfContactTypes: contactTypes[] = [
  {
    imgSrc: "/img/profile-pic1.png",
    name: "Monkey D. Luffy",
    lastMessage: "Luffy: Hey",
    selected: true,
  },
  {
    imgSrc: "/img/profile-pic2.png",
    name: "Roronoa Zoro",
    lastMessage: "Zoro: Hey",
  },
  {
    imgSrc: "/img/profile-pic4.png",
    name: "Vinsmoke Sanji",
    lastMessage: "Nami: Hey",
  },

  {
    imgSrc: "/img/profile-pic3.png",
    name: "Catburglar Nami",
    lastMessage: "Sanji: Hey",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const context = useContext(Context);

  const logout = async () => {
    try {
      const request = await fetch("/api/logout", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (request.status === 200) {
        context?.setLoggedIn(false);
        context?.setUser({
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          password: "",
          type: "",
          imgUrl: "",
        });
        context?.setInitialized(false);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#183B4E] w-fit min-w-[350px] max-w-[420px] h-full rounded-2xl flex flex-col">
      <div className="w-full h-fit px-4 py-5 flex flex-col gap-4">
        <div className="w-full h-fit flex justify-between items-center">
          <h4 className="font-sans font-semibold text-white text-2xl">Chats</h4>
          <Popover>
            <PopoverTrigger className="cursor-pointer">
              <EllipsisVertical className="w-6 h-6 text-white" />
            </PopoverTrigger>
            <PopoverContent className="bg-[#F5EEDC] w-fit h-fit p-0 flex flex-col gap-1 py-2 border border-[#183B4E]">
              <button className="px-3 py-1 flex gap-2 items-center font-sans font-medium text-start cursor-pointer text-[#183B4E] hover:bg-gray-600/15">
                <UserRound className="w-4 h-4" />
                Profile Settings
              </button>
              <button
                onClick={logout}
                className="px-3 py-1 flex gap-2 items-center font-sans font-medium text-start cursor-pointer text-[#183B4E] hover:bg-gray-600/15"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </PopoverContent>
          </Popover>
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

      <div className="px-2 w-full h-full flex flex-col overflow-y-auto">
        {listOfContactTypes.map((contact, id) => (
          <Contacts
            key={id}
            contactId={id}
            imgSrc={contact.imgSrc}
            name={contact.name}
            lastMessage={contact.lastMessage}
            selected={contact.selected}
          />
        ))}
      </div>
    </div>
  );
}
