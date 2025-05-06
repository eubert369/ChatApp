import React, { useContext } from "react";
import Image from "next/image";
import { auth } from "./firebase/Config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/router";
import { Context } from "./ContextProvider";
import { toast } from "sonner";

const provider = new GoogleAuthProvider();

export default function GoogleAuthBtn() {
  const router = useRouter();
  const context = useContext(Context);

  const clickEvent = async () => {
    try {
      const googleSignIn = await signInWithPopup(auth, provider);
      const loadingID = toast.loading("Logging in");
      const user = googleSignIn.user;

      if (user) {
        const displayName: string[] | undefined = user.displayName?.split(" ");

        const firstName: string = displayName
          ? displayName.slice(0, -1).join(" ")
          : "";

        const lastName: string = displayName
          ? displayName[displayName.length - 1]
          : "";

        const req = await fetch("/api/oauth", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: user.email,
            imgURL: user.photoURL,
          }),
        });

        if (req.status === 200) {
          const res = await req.json();
          context?.setUser(res.user);
          context?.setLoggedIn(true);
          toast.success("Loggedin successfully", { id: loadingID });
          router.push("/chats");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <button
      type="button"
      onClick={clickEvent}
      className="w-full h-fit py-2 rounded-[8px] border border-[#27548A] font-sans font-bold text-base text-[#27548A] bg-[#F5EEDC] hover:text-[#27548A] cursor-pointer flex items-center justify-center gap-2 hover:scale-105"
    >
      <i>
        <Image
          src={"/icons/google-icon.svg"}
          alt="google icon"
          priority
          width={16}
          height={16}
        />
      </i>
      Continue with Google
    </button>
  );
}
