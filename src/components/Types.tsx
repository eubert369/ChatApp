export interface contactTypes {
  contactId?: string;
  userId: string;
  imgSrc: string;
  name: string;
  latestMessage: string;
  timestamp: string;
  selected?: boolean;
}

export interface chatItemTypes {
  message: string;
  received?: boolean;
  profilePicUrl: string | undefined;
  date?: string;
}

export interface userTypes {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  imgUrl: string;
  type: string;
}

export interface contextTypes {
  user: userTypes;
  setUser: (value: userTypes) => void;
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  initialized: boolean;
  setInitialized: (value: boolean) => void;
  currentUserId: string;
  setCurrentUserId: (value: string) => void;
}

export interface userSearchTypes {
  id: string;
  name: string;
  email: string;
  imgUrl: string;
}

export interface createConvoFormTypes {
  recipientId: string;
  name: string;
  message: string;
}

export interface contactInfoTypes {
  userId: string;
  imgUrl: string;
  name: string;
}

export interface allMessageResponseTypes {
  message: string;
  received: boolean;
  date: number;
  profilePicUrl: string;
}

export interface requestedContactTypes {
  convoId: string,
  userId: string,
  name: string,
  imgSrc: string,
  latestMessage: string,
  timestamp: string,
}