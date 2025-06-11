import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  EllipsisVertical,
  Search,
  LogOut,
  UserRound,
  SquarePen,
} from "lucide-react";
import Contacts from "./Contacts";
import {
  contactTypes,
  userTypes,
  userSearchTypes,
  createConvoFormTypes,
  requestedContactTypes,
} from "./Types";
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
import LoadingContacts from "./LoadingContacts";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { Context } from "./ContextProvider";
import { db } from "./firebase/Config";
import { onSnapshot, collection } from "firebase/firestore";

export default function Sidebar() {
  const router = useRouter();
  const { id } = router.query;
  const context = useContext(Context);
  const [listOfContacts, setListOfContacts] = useState<contactTypes[]>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("/icons/user-filler-icon.svg");
  const [openUserSearch, setOpenUserSearch] = useState<boolean>(false);
  const [userSearchMatched, setUserSearchMatched] = useState<boolean>(false);
  const [contactsLoading, setContactsLoading] = useState<boolean>(true);
  const [searchedUsers, setSearchedUsers] = useState<userSearchTypes[]>([]);
  const [createConvoForm, setCreateConvoForm] = useState<createConvoFormTypes>({
    name: "",
    recipientId: "",
    message: "",
  });

  const closeCreateMessageDialog = useRef<HTMLButtonElement | null>(null);

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

  useEffect(() => {
    const fetchContacts = async () => {
      const request = await fetch("/api/contacts");
      const response = await request.json();

      // console.log("initial contact fetching response:", response);
      if (response.contacts !== undefined) {
        const sortMappedContacts = response.contacts
          .map((item: requestedContactTypes) => {
            return {
              contactId: item.convoId,
              userId: item.userId,
              imgSrc: item.imgSrc,
              name: item.name,
              latestMessage: item.latestMessage,
              timestamp: item.timestamp,
            };
          })
          .sort(
            (a: requestedContactTypes, b: requestedContactTypes) =>
              new Date(a.timestamp) < new Date(b.timestamp)
          );

        setListOfContacts(sortMappedContacts);
      }
      setContactsLoading(false);
    };

    const unsubscribe = onSnapshot(collection(db, "messages"), () => {
      setContactsLoading(true);
      fetchContacts();
    });

    return () => unsubscribe();
  }, [context?.currentUserId]);

  const logout = async () => {
    try {
      const loadingID = toast.loading("Logging out");
      const request = await fetch("/api/auth/logout", {
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
        context?.setCurrentUserId("");
        context?.setInitialized(false);
        toast.success("Logged out successfully", { id: loadingID });
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
        toast.error(`${request.status} Failed to update profile`, {
          id: loadingId,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserSearch = async (str: string) => {
    try {
      if (str.length > 0) {
        const request = await fetch(`/api/users/search/${str}`);
        const response = await request.json();

        if (request.status === 200 && response.items.length > 0) {
          setUserSearchMatched(true);
          setSearchedUsers(
            response.items.filter(
              (items: userSearchTypes) => items.id !== context?.currentUserId
            )
          );
        } else if (request.status === 401) {
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
          toast.warning("Session Timed out");
          router.push("/");
        } else {
          setUserSearchMatched(false);
          console.log("response:", "Nothing Matches");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartConvoSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const loadingID = toast.loading("Sending message");
    try {
      const req = await fetch("/api/messages/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId: createConvoForm.recipientId,
          message: createConvoForm.message,
        }),
      });
      const res = await req.json();

      if (req.status === 200) {
        console.log("response", res);
        if (closeCreateMessageDialog.current) {
          closeCreateMessageDialog.current.click();
        }
        toast.success("Message Sent", { id: loadingID });
        router.push(`/chats/${res.convoId}`);
      } else if (req.status === 409) {
        toast.warning(`${res.message} with ${createConvoForm.name}`, {
          id: loadingID,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed", { id: loadingID });
    }
  };

  return (
    <div className="bg-[#183B4E] w-fit min-w-[350px] max-w-[420px] h-full rounded-2xl flex flex-col relative">
      <div className="w-full h-fit px-4 py-5 flex flex-col gap-4">
        <div className="w-full h-fit flex justify-between items-center">
          <h4 className="font-sans font-semibold text-white text-2xl">Chats</h4>
          <Popover>
            <PopoverTrigger className="cursor-pointer">
              <EllipsisVertical className="w-6 h-6 text-white hover:scale-125 transition-all duration-200" />
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
      <div className="px-2 w-full h-full flex flex-col overflow-y-auto relative">
        {listOfContacts.length === 0 && contactsLoading ? (
          <LoadingContacts />
        ) : (
          listOfContacts.map((contact, mapID) => (
            <Contacts
              key={mapID}
              contactId={contact.contactId}
              userId={contact.userId}
              imgSrc={contact.imgSrc}
              name={contact.name}
              latestMessage={contact.latestMessage}
              timestamp={contact.timestamp}
              selected={!!id && id == contact.contactId}
            />
          ))
        )}
        {listOfContacts.length === 0 && !contactsLoading && (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <Image
              src={"/img/select-message.svg"}
              alt="No Conversations"
              width={200}
              height={200}
            />
            <span className="text-center font-bold">
              No conversations yet.
              <br />
              Start a new chat!
            </span>
          </div>
        )}
      </div>
      <div className="absolute right-4 bottom-4 w-fit h-fit">
        <Dialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="bg-white rounded-full p-3 cursor-pointer shadow-lg hover:scale-110"
                >
                  <SquarePen className="text-[#183B4E] w-4 h-4" />
                </button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Start a New Conversation</TooltipContent>
          </Tooltip>
          <DialogContent
            showCloseButton={false}
            className="w-full bg-[#F5EEDC] text-[#183B4E]"
          >
            <DialogHeader className="border-b border-[#183B4E]/30 pb-2">
              <DialogTitle>Start Conversation</DialogTitle>
              <DialogDescription>
                Connect with people to initiate your conversation.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleStartConvoSubmit}
              className="w-full h-fit flex flex-col gap-3"
            >
              <div className="w-full h-fit inline-flex flex-col gap-1 relative">
                <label htmlFor="nameEmail">Name/Email</label>
                <input
                  id="nameEmail"
                  type="text"
                  onChange={(e) => {
                    setUserSearchMatched(false);
                    setOpenUserSearch(e.target.value.length > 0);
                    handleUserSearch(e.target.value);
                    setCreateConvoForm({
                      ...createConvoForm,
                      name: e.target.value,
                    });

                    if (e.target.value.length === 0) {
                      setCreateConvoForm({
                        ...createConvoForm,
                        name: e.target.value,
                        recipientId: "",
                      });
                    }
                  }}
                  onFocus={(e) => setOpenUserSearch(e.target.value.length > 0)}
                  value={createConvoForm.name}
                  autoComplete="off"
                  placeholder="Start typing names or emails"
                  className="w-full h-fit px-2 py-1 rounded-md border border-[#183B4E]/50 focus:outline-none focus:border-[#183B4E]/50 text-[#183B4E]"
                />
                {openUserSearch && (
                  <div className="absolute end-0 top-16 z-auto w-full h-fit max-h-44 overflow-y-auto bg-[#F5EEDC] border shadow-md rounded-md flex flex-col gap-1">
                    {searchedUsers.length > 0 ? (
                      searchedUsers.map((user, id) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            console.log("user ID:", user.id);
                            setUserSearchMatched(false);
                            setOpenUserSearch(false);
                            setCreateConvoForm({
                              ...createConvoForm,
                              recipientId: user.id,
                              name: user.name,
                            });
                          }}
                          className="w-full h-fit p-3 flex items-center gap-3 cursor-pointer hover:bg-black/10"
                        >
                          <Image
                            alt="img-icon"
                            width={40}
                            height={40}
                            src={
                              user.imgUrl.length > 0
                                ? user.imgUrl
                                : "/icons/user-filler-icon.svg"
                            }
                            className="rounded-full"
                          />
                          <div className="w-full h-fit flex flex-col">
                            <h5 className="text-base text-[#183B4E] text-start font-medium">
                              {user.name}
                            </h5>
                            <p className="text-xs text-muted-foreground text-start font-normal">
                              {user.email}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <span className="text-[#183B4E] text-center">
                        {userSearchMatched ? "No user found" : "Searching ..."}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="w-full h-fit flex flex-col gap-1">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Type your message..."
                  onKeyUp={(e) => {
                    setCreateConvoForm({
                      ...createConvoForm,
                      message: e.currentTarget.value,
                    });
                  }}
                  className="w-full h-fit px-2 py-1 rounded-md border border-[#183B4E]/50 focus:outline-none focus:border-[#183B4E]/50 text-[#183B4E]"
                ></textarea>
              </div>

              <div className="w-full h-fit flex items-center justify-end gap-2">
                <DialogClose
                  ref={closeCreateMessageDialog}
                  className="w-fit h-fit px-3 py-1 cursor-pointer hover:underline hover:scale-105 transition-all duration-100"
                >
                  Cancel
                </DialogClose>
                <button
                  type="submit"
                  className="w-fit h-fit px-3 py-1 bg-[#183B4E] text-white rounded-md cursor-pointer hover:scale-105 transition-all duration-100"
                >
                  Create
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
