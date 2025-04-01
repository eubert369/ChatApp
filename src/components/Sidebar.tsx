import React from "react";

export default function Sidebar() {
  return (
    <div className="bg-[#183B4E] w-fit max-w-[420px] h-full rounded-2xl flex flex-col">
      <div className="w-full h-fit px-6 py-5 flex flex-col gap-4">
        <div className="w-full h-fit flex justify-between">
            <h4 className="font-sans font-semibold text-white text-2xl">Chats</h4>
        </div>
      </div>
    </div>
  );
}
