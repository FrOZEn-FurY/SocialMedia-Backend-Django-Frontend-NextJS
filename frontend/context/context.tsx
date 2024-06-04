'use client'
import { createContext, useState } from "react";

interface ContextProps {
  children: React.ReactNode;
}

interface OtherUsers {
  id: number;
  username: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  followings: OtherUsers[];
}

interface ContextTypes {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
  userGot: boolean;
  setUserGot: (userGot: boolean) => void;
}

export const context = createContext({} as ContextTypes);

export default function ContextProvider({ children }: ContextProps) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userGot, setUserGot] = useState(false);
  return (
    <context.Provider value={{ user, setUser, userGot, setUserGot }}>{children}</context.Provider>
  );
}
