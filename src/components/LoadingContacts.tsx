import React from "react";
import { Skeleton } from "./ui/skeleton";

export default function LoadingContacts() {
  return (
    <>
      <div className="w-full h-fit px-2 py-2 flex gap-2 rounded-md items-center">
        <Skeleton className="rounded-full w-[56px] h-[56px] min-w-[56px] min-h-[56px]" />
        <div className="w-full h-fit flex flex-col text-start gap-2">
          <Skeleton className="w-3/4 h-5" />
          <Skeleton className="w-1/2 h-3" />
        </div>
      </div>
      <div className="w-full h-fit px-2 py-2 flex gap-2 rounded-md items-center">
        <Skeleton className="rounded-full w-[56px] h-[56px] min-w-[56px] min-h-[56px]" />
        <div className="w-full h-fit flex flex-col text-start gap-2">
          <Skeleton className="w-3/4 h-5" />
          <Skeleton className="w-1/2 h-3" />
        </div>
      </div>
      <div className="w-full h-fit px-2 py-2 flex gap-2 rounded-md items-center">
        <Skeleton className="rounded-full w-[56px] h-[56px] min-w-[56px] min-h-[56px]" />
        <div className="w-full h-fit flex flex-col text-start gap-2">
          <Skeleton className="w-3/4 h-5" />
          <Skeleton className="w-1/2 h-3" />
        </div>
      </div>
      <div className="w-full h-fit px-2 py-2 flex gap-2 rounded-md items-center">
        <Skeleton className="rounded-full w-[56px] h-[56px] min-w-[56px] min-h-[56px]" />
        <div className="w-full h-fit flex flex-col text-start gap-2">
          <Skeleton className="w-3/4 h-5" />
          <Skeleton className="w-1/2 h-3" />
        </div>
      </div>
    </>
  );
}
