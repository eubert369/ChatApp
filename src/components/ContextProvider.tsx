import React, { createContext, useState } from "react";
import { userTypes, contextTypes } from "./Types";

const emptyUserProps: userTypes = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  type: "",
  imgUrl: "",
};

export const Context = createContext<contextTypes | undefined>(undefined);

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [user, setUser] = useState<userTypes>(emptyUserProps);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        loggedIn,
        setLoggedIn,
        initialized,
        setInitialized,
        currentUserId,
        setCurrentUserId
      }}
    >
      {children}
    </Context.Provider>
  );
}
