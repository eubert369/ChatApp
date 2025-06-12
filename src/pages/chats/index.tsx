import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Context } from "@/components/ContextProvider";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Head from "next/head";

export default function Chats() {
  const router = useRouter();
  const context = useContext(Context);
  const [openProfileDialog, setOpenProfileDialog] = useState<boolean>(false);
  const [profileImg, setProfileImg] = useState<string>(
    "icons/user-filler-icon.svg"
  );

  if (!context) {
    throw new Error("ChildComponent must be used within a ContextProvider");
  }

  useEffect(() => {
    const validateUser = async () => {
      try {
        const req = await fetch("/api/users/profile");
        if (req.status === 200) {
          const user = await req.json();
          context.setUser(user);
          context.setCurrentUserId(user.id);
          context.setInitialized(true);
          context.setLoggedIn(true);
        } else {
          const logout = await fetch("/api/logout", {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          });

          if (logout.status === 200) {
            context.setLoggedIn(false);
            router.push("/");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (!context.initialized) {
      validateUser();
    } else {
      if (context.user.imgUrl === "" || context.user.imgUrl === undefined) {
        setOpenProfileDialog(true);
      }
    }
  }, [context, router]);

  const handleProfileImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImgSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const loadingId = toast.loading("Updating profile...");
      const req = await fetch("/api/users/profile/update", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          firstName: context.user.firstName,
          lastName: context.user.lastName,
          email: context.user.email,
          username: context.user.username,
          password: context.user.password,
          type: context.user.type,
          imgUrl: profileImg,
        }),
      });

      if (req.status === 200) {
        const res = await req.json();
        if (context) {
          context.setUser(res.user);
          context.setInitialized(true);
          context.setLoggedIn(true);
        }
        toast.success("Profile updated successfully", { id: loadingId });
        setOpenProfileDialog(false);
      } else {
        toast.error(`${req.status} Failed to update profile`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Chats</title>
      </Head>
      <Navbar />
      <div className="w-full h-full flex items-center justify-center flex-col gap-3">
        <div className="relative w-2/3 h-2/3">
          <Image
            src={"/img/group-people-chatting.png"}
            alt="Icon"
            sizes="100"
            fill
            priority
          />
        </div>
        <h3 className="font-sans text-2xl text-[#183B4E]">
          No Selected Conversation
        </h3>
      </div>

      <Dialog open={openProfileDialog} onOpenChange={setOpenProfileDialog}>
        <DialogContent className="w-full h-fit bg-[#F5EEDC] flex flex-col gap-4 text-[#183B4E]">
          <DialogHeader className="hidden">
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="w-full h-fit">
            <h3 className="text-2xl font-semibold text-center">
              Upload Your Profile Picture
            </h3>
            <p className="text-center">
              This will be your profile picture for all of your conversations.
            </p>
          </div>

          <div className="w-full h-fit flex flex-col items-center gap-3">
            <div className="w-[160px] h-[160px] max-w-[160px] max-h-[160px] relative">
              <Image
                src={profileImg}
                fill
                alt="image"
                className="border rounded-full border-[#183B4E]"
              />
            </div>

            <form
              onSubmit={handleProfileImgSubmit}
              className="w-fit h-fit flex items-center gap-2"
            >
              <input
                type="file"
                id="profileImg"
                accept="image/*"
                onChange={handleProfileImgChange}
                hidden
              />
              <label
                htmlFor="profileImg"
                className="cursor-pointer px-3 py-1 rounded-md bg-[#183B4E] text-white hover:scale-105"
              >
                Upload
              </label>
              <button
                type="submit"
                className="px-3 ring-0 py-1 rounded-md bg-[#183B4E] text-white cursor-pointer hover:scale-105"
              >
                Save
              </button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
