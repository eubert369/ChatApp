import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { EllipsisVertical, Search, LogOut, UserRound } from "lucide-react";
import Contacts from "./Contacts";
import { contactTypes, userTypes } from "./Types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { toast } from "sonner";
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
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("/icons/user-filler-icon.svg");

  const setContextData = (user: userTypes | undefined) => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setUsername(user.username);
      setPassword(user.password);
      setImgUrl(user.imgUrl);
    }
  };

  useEffect(() => {
    if (context?.user) {
      setContextData(context.user);
    }
  }, [context]);

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

  const handleProfileImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const loadingId = toast.loading("Updating profile...");
      const request = await fetch("/api/users/profile/update", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          username,
          password,
          type: context?.user.type,
          imgUrl,
        }),
      });

      if (request.status === 200) {
        const res = await request.json();
        toast.success("Profile updated successfully", { id: loadingId });
        if (context) {
          context.setUser(res.user);
          context.setInitialized(true);
          context.setLoggedIn(true);
        }
      } else {
        toast.error(`${request.status} Failed to update profile`, { id: loadingId });
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
              <EllipsisVertical className="w-6 h-6 text-white hover:scale-105" />
            </PopoverTrigger>
            <PopoverContent className="bg-[#F5EEDC] w-fit h-fit p-0 flex flex-col gap-1 py-2 border border-[#183B4E]">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    onClick={() => setContextData(context?.user)}
                    className="px-3 py-1 flex gap-2 items-center font-sans font-medium text-start cursor-pointer text-[#183B4E] hover:bg-gray-600/15"
                  >
                    <UserRound className="w-4 h-4" />
                    Profile Settings
                  </button>
                </DialogTrigger>
                <DialogContent
                  showCloseButton={false}
                  className="w-full bg-[#F5EEDC] text-[#183B4E]"
                >
                  <DialogHeader className="border-b border-[#183B4E]/30 pb-2">
                    <DialogTitle>Profile Details</DialogTitle>
                    <DialogDescription>
                      You can change your profile here seamlessly.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={handleProfileFormSubmit}
                    className="w-full h-fit flex flex-col gap-6"
                  >
                    <div className="w-full h-fit flex items-center gap-3">
                      <div className="relative w-28 h-28 rounded-full overflow-hidden">
                        <Image
                          src={imgUrl || "/icons/user-filler-icon.svg"}
                          alt="Image Icon"
                          sizes="100"
                          fill
                          priority
                        />
                      </div>
                      <div className="w-fit h-fit flex flex-col gap-2">
                        <input
                          type="file"
                          hidden
                          id="profileImg"
                          accept="image/*"
                          onChange={handleProfileImgChange}
                        />
                        <label
                          htmlFor="profileImg"
                          className="bg-[#183B4E] border border-[#183B4E] w-fit h-fit px-3 py-1 rounded-md text-white text-sm hover:scale-105 transition-all duration-200"
                        >
                          Change picture
                        </label>
                        <button
                          type="button"
                          onClick={() => setImgUrl("")}
                          className="bg-[#E52020] border border-[#E52020] w-fit h-fit px-3 py-1 rounded-md text-white text-sm hover:scale-105 transition-all duration-200"
                        >
                          Delete picture
                        </button>
                      </div>
                    </div>

                    <div className="w-full h-fit flex flex-col gap-3">
                      <div className="w-full h-fit flex items-center gap-4">
                        <div className="w-full h-fit flex flex-col gap-1">
                          <label
                            htmlFor="firstName"
                            className="text-[#183B4E] font-sans font-medium text-sm"
                          >
                            First Name
                          </label>
                          <input
                            required
                            type="text"
                            id="firstName"
                            className="w-full h-fit px-3 py-1 rounded-md border border-[#183B4E]/30 focus:outline-none focus:border-[#183B4E] text-[#183B4E]"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div className="w-full h-fit flex flex-col gap-1">
                          <label
                            htmlFor="lastName"
                            className="text-[#183B4E] font-sans font-medium text-sm"
                          >
                            Last Name
                          </label>
                          <input
                            required
                            type="text"
                            id="lastName"
                            className="w-full h-fit px-3 py-1 rounded-md border border-[#183B4E]/30 focus:outline-none focus:border-[#183B4E] text-[#183B4E]"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="w-full h-fit flex flex-col gap-1">
                        <label
                          htmlFor="email"
                          className="text-[#183B4E] font-sans font-medium text-sm"
                        >
                          Email
                        </label>
                        <input
                          required
                          type="email"
                          id="email"
                          className="w-full h-fit px-3 py-1 rounded-md border border-[#183B4E]/30 focus:outline-none focus:border-[#183B4E] text-[#183B4E]"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="w-full h-fit flex items-center gap-4">
                        <div className="w-full h-fit flex flex-col gap-1">
                          <label
                            htmlFor="username"
                            className="text-[#183B4E] font-sans font-medium text-sm"
                          >
                            Username
                          </label>
                          <input
                            required
                            type="text"
                            id="username"
                            className="w-full h-fit px-3 py-1 rounded-md border border-[#183B4E]/30 focus:outline-none focus:border-[#183B4E] text-[#183B4E]"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>
                        <div className="w-full h-fit flex flex-col gap-1">
                          <label
                            htmlFor="password"
                            className="text-[#183B4E] font-sans font-medium text-sm"
                          >
                            Password
                          </label>
                          <input
                            required
                            type="password"
                            id="password"
                            className="w-full h-fit px-3 py-1 rounded-md border border-[#183B4E]/30 focus:outline-none focus:border-[#183B4E] text-[#183B4E]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-fit flex items-center justify-end gap-3">
                      <DialogClose
                        type="button"
                        className="bg-none border border-[#183B4E] w-fit h-fit px-3 py-1 rounded-md text-[#183B4E] font-semibold text-sm cursor-pointer hover:scale-110 transition-all duration-200"
                      >
                        Discard
                      </DialogClose>
                      <button
                        type="submit"
                        className="bg-[#183B4E] border border-[#183B4E] w-fit h-fit px-3 py-1 rounded-md text-white font-semibold text-sm cursor-pointer hover:scale-110 transition-all duration-200"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

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
