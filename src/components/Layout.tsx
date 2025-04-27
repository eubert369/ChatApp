import { useRouter } from "next/router";
import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Toaster } from "./ui/sonner";

const layoutExlusionRoutes: string[] = ["/", "/auth/login", "/auth/signup"];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isLayoutExcluded: boolean = layoutExlusionRoutes.includes(
    router.pathname
  );

  if (!isLayoutExcluded) {
    return (
      <div className="bg-[#F5EEDC] w-full h-screen p-3 flex gap-6">
        <Sidebar />
        <main className="w-full h-full flex flex-col gap-2">
          <Navbar withSelectedConvo={router.pathname !== "/chats"} />
          {children}
        </main>
        <Toaster />
      </div>
    );
  } else {
    return <main>{children}</main>;
  }
}
