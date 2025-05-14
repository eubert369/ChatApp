export interface contactTypes {
  contactId?: number;
  imgSrc: string;
  name: string;
  lastMessage: string;
  selected?: boolean;
}

export interface chatItemTypes {
  message: string;
  received?: boolean;
  profilePicUrl: string;
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
  message: string;
}