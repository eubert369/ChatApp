import React, { createContext, useState } from "react";
import { userTypes, contextTypes } from "./Types";

const emptyUserProps: userTypes = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  imgUrl: "",
};

const Context = createContext<contextTypes | undefined>(undefined);

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<userTypes>(emptyUserProps);

  return (
    <Context.Provider value={{ user, setUser }}>{children}</Context.Provider>
  );
}
