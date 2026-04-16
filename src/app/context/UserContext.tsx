import { createContext, useContext, useState, ReactNode } from 'react';
import imgAvatar1 from "@/assets/732125209de61c74d77a729d196eb37e209973de.png"; 

interface UserContextType {
  avatar: string;
  setAvatar: (avatar: string) => void;
  name: string;
  setName: (name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Default avatar
  const [avatar, setAvatar] = useState<string>(imgAvatar1);
  const [name, setName] = useState<string>("Elena zhang");

  return (
    <UserContext.Provider value={{ avatar, setAvatar, name, setName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
