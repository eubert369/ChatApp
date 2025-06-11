import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import { Toaster } from "./ui/sonner";

const layoutExlusionRoutes: string[] = ["/", "/auth/login", "/auth/signup"];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isLayoutExcluded: boolean = layoutExlusionRoutes.includes(
    router.pathname
  );

  if (!isLayoutExcluded) {
    return (
      <>
        <div className={`bg-[#F5EEDC] p-0 w-full h-screen flex gap-6 sm:p-3`}>
          <Sidebar />
          <main
            className={`${
              router.pathname != "/chats" ? "flex" : "hidden"
            } sm:flex w-full h-full flex-col gap-2`}
          >
            {children}
          </main>
        </div>
        <Toaster richColors theme="light" position="top-right" />
      </>
    );
  } else {
    return (
      <>
        <main>{children}</main>
        <Toaster richColors theme="light" position="top-right" />
      </>
    );
  }
}
